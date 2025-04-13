import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import ListCard from "@/components/ListCard";
import TaskFormModal from "@/components/TaskFormModal";
import useTasks from "@/hooks/useTasks";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function CalendarView() {
  const tasks = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const taskDate = task.date?.toDate();
    return taskDate && taskDate.toDateString() === selectedDate.toDateString();
  });

  const toggleCompleted = async (taskId, newValue) => {
    try {
      const ref = doc(db, "tasks", taskId);
      await updateDoc(ref, { completed: newValue });
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4">
          <Calendar
            inline
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value)}
            className="w-100"
          />
        </div>

        <div className="col-md-8">
          <span className="d-block py-3">
            Tareas para el {selectedDate.toLocaleDateString("es-AR")}
          </span>
          {filteredTasks.length === 0 ? (
            <p className="text-muted">No hay tareas para este día.</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filteredTasks.map((task) => (
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
        </div>
      </div>
    </div>
  );
}
