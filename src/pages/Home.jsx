import { useState } from "react";
import Topbar from "@/components/Topbar";
import ListCard from "@/components/ListCard";
import TaskFormModal from "@/components/TaskFormModal";
import useTasks from "@/hooks/useTasks";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatDate } from "@/utils/formatDate";
import { ProgressBar } from "primereact/progressbar";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const tasks = useTasks();
  const [collapsed, setCollapsed] = useState({
    Mañana: true,
    "Pasado mañana": true,
  });
  const [showCompleted, setShowCompleted] = useState({});

  const priorityWeight = {
    alta: 1,
    media: 2,
    baja: 3,
  };

  const toggleCollapsed = (label) => {
    setCollapsed((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleShowCompleted = (label) => {
    setShowCompleted((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const getLabelForDate = (dateKey) => {
    const today = new Date();
    const target = new Date(dateKey);
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    switch (diff) {
      case 0:
        return "Hoy";
      case 1:
        return "Mañana";
      case 2:
        return "Pasado mañana";
      default:
        return formatDate(target);
    }
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
    const diffInDays = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    return diffInDays >= 0 && diffInDays <= 2;
  });

  const todayTasksGroup = groupedTasks.find(
    ([dateKey]) => getLabelForDate(dateKey) === "Hoy"
  );

  const todayTasks = todayTasksGroup ? todayTasksGroup[1] : [];
  const completedCount = todayTasks.filter((t) => t.completed).length;
  const totalCount = todayTasks.length;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getProgressColor = () => {
    if (progress >= 80) return "success";
    if (progress >= 40) return "warning";
    return "danger";
  };

  const toggleCompleted = async (taskId, newValue) => {
    try {
      const ref = doc(db, "tasks", taskId);
      await updateDoc(ref, { completed: newValue });
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  const sortByPriority = (tasks) => {
    return [...tasks].sort((a, b) => {
      const p1 = priorityWeight[a.priority] || 4;
      const p2 = priorityWeight[b.priority] || 4;
      return p1 - p2;
    });
  };

  const moveToTomorrow = async (taskId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    try {
      const ref = doc(db, "tasks", taskId);
      await updateDoc(ref, { date: Timestamp.fromDate(tomorrow) });
    } catch (err) {
      console.error("Error al mover tarea a mañana:", err);
    }
  };

  const getProgressColorForGroup = (done, total) => {
    const percent = total > 0 ? (done / total) * 100 : 0;
    if (percent >= 80) return "success";
    if (percent >= 40) return "warning";
    return "danger";
  };

  return (
    <div className="container-fluid vh-100 overflow-hidden">
      <div className="row h-100">
        <div className="col-12 d-flex flex-column p-0 content-area">
          <main className="flex-grow-1 scroll-mac p-3">
            {tasks.length === 0 && (
              <p className="text-muted">No tenés tareas aún.</p>
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
      </div>

      <TaskFormModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      />
    </div>
  );
}
