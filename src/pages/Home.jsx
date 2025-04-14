import { useState } from "react";
import ListCard from "@/components/ListCard";
import TaskFormModal from "@/components/TaskFormModal";
import useTasks from "@/hooks/useTasks";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatDate } from "@/utils/formatDate";
import { Skeleton } from "primereact/skeleton";
import { useAuth } from "@/context/AuthContext";
import splash from "@/assets/splash.png";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const tasks = useTasks();
  const [collapsed, setCollapsed] = useState({
    Mañana: true,
    "Pasado mañana": true,
  });
  const [showCompleted, setShowCompleted] = useState({});

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
        <div className="text-center">
          <img
            src={splash}
            alt="Cargando"
            style={{ maxWidth: 200, marginBottom: 20 }}
          />
          <p className="text-muted">Cargando tu espacio de trabajo...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const priorityWeight = { alta: 1, media: 2, baja: 3 };

  const toggleCollapsed = (label) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  const toggleShowCompleted = (label) =>
    setShowCompleted((prev) => ({ ...prev, [label]: !prev[label] }));

  const getLabelForDate = (dateKey) => {
    const today = new Date();
    const target = new Date(dateKey);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    return diff === 0
      ? "Hoy"
      : diff === 1
      ? "Mañana"
      : diff === 2
      ? "Pasado mañana"
      : formatDate(target);
  };

  const groupTasksByDate = (tasks) => {
    const groups = {};
    tasks.forEach((task) => {
      const dateKey = task.date?.toDate().toDateString() || "Sin fecha";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(task);
    });
    return Object.entries(groups).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    );
  };

  const groupedTasks = groupTasksByDate(tasks).filter(([dateKey]) => {
    const target = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 2;
  });

  const toggleCompleted = async (taskId, newValue) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { completed: newValue });
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  const moveToTomorrow = async (taskId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    try {
      await updateDoc(doc(db, "tasks", taskId), {
        date: Timestamp.fromDate(tomorrow),
      });
    } catch (err) {
      console.error("Error al mover tarea a mañana:", err);
    }
  };

  const sortByPriority = (tasks) =>
    [...tasks].sort(
      (a, b) =>
        (priorityWeight[a.priority] || 4) - (priorityWeight[b.priority] || 4)
    );

  const getProgressColorForGroup = (done, total) => {
    const percent = total > 0 ? (done / total) * 100 : 0;
    return percent >= 80 ? "success" : percent >= 40 ? "warning" : "danger";
  };

  return (
    <div className="row ">
      <div className="col-12 d-flex flex-column p-0 content-area">
        <main className="flex-grow-1 scroll-mac p-3">
          {!tasks.length && (
            <>
              <Skeleton width="20%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
              <Skeleton width="100%" height="2rem" className="mb-3" />
            </>
          )}

          {groupedTasks.map(([dateKey, items]) => {
            const label = getLabelForDate(dateKey);
            const isTodayGroup = label === "Hoy";
            const isCollapsed = collapsed[label] && !isTodayGroup;
            const done = items.filter((t) => t.completed).length;
            const pendingTasks = sortByPriority(
              items.filter((t) => !t.completed)
            );
            const completedTasks = sortByPriority(
              items.filter((t) => t.completed)
            );

            return (
              <div key={dateKey} className="mb-4" data-datekey={dateKey}>
                <h4
                  className="date-header w-100 mb-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: !isTodayGroup ? "pointer" : "default" }}
                  onClick={() => !isTodayGroup && toggleCollapsed(label)}
                >
                  <span>
                    {label}{" "}
                    <span
                      className={`badge bg-${getProgressColorForGroup(
                        done,
                        items.length
                      )}`}
                    >
                      ({done} / {items.length})
                    </span>
                  </span>
                  {!isTodayGroup && (
                    <i
                      className={`pi ${
                        isCollapsed ? "pi-chevron-down" : "pi-chevron-up"
                      }`}
                    />
                  )}
                </h4>

                {!isCollapsed && (
                  <div className="d-flex flex-column gap-2">
                    {pendingTasks.map((task) => (
                      <ListCard
                        key={task.id}
                        taskId={task.id}
                        title={task.title}
                        date={task.date?.toDate()}
                        priority={task.priority}
                        assignedTo={null}
                        completed={task.completed}
                        onToggle={toggleCompleted}
                        {...(label === "Hoy" && {
                          onMoveToTomorrow: () => moveToTomorrow(task.id),
                        })}
                      />
                    ))}

                    {completedTasks.length > 0 && (
                      <>
                        <button
                          className="btn btn-sm btn-link text-secondary text-start mt-2"
                          onClick={() => toggleShowCompleted(label)}
                        >
                          {showCompleted[label] ? "Ocultar" : "Ver"} tareas
                          terminadas
                        </button>

                        {showCompleted[label] && (
                          <div className="d-flex flex-column gap-2">
                            {completedTasks.map((task) => (
                              <ListCard
                                key={task.id}
                                taskId={task.id}
                                title={task.title}
                                date={task.date?.toDate()}
                                priority={task.priority}
                                assignedTo={null}
                                completed={task.completed}
                                onToggle={toggleCompleted}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>

      <TaskFormModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      />
    </div>
  );
}
