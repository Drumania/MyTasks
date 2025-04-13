import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { db } from "@/firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function TaskFormModal({ visible, onHide }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("baja");
  const [useToday, setUseToday] = useState(true); // ✅ default
  const [customDate, setCustomDate] = useState(null);

  const priorities = [
    { label: "Alta", value: "alta" },
    { label: "Media", value: "media" },
    { label: "Baja", value: "baja" },
  ];

  const handleSubmit = async () => {
    if (!title.trim()) return alert("El título es obligatorio");

    const taskData = {
      title,
      date: useToday
        ? Timestamp.now()
        : customDate
        ? Timestamp.fromDate(customDate)
        : null,
      priority,
      completed: false,
      userId: user.uid,
      createdAt: Timestamp.now(),
      order: Date.now(),
    };

    try {
      await addDoc(collection(db, "tasks"), taskData);
      onHide();
      resetForm();
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      alert("Ocurrió un error al guardar la tarea.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setPriority(null);
    setUseToday(true);
    setCustomDate(null);
  };

  return (
    <Dialog
      header="Nueva Tarea"
      visible={visible}
      style={{ width: "400px" }}
      onHide={onHide}
      modal
    >
      <div className="mb-3">
        <label>Título</label>
        <InputText
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-100"
        />
      </div>

      <div className="mb-3 d-flex align-items-center gap-2">
        <Checkbox
          inputId="useToday"
          checked={useToday}
          onChange={(e) => setUseToday(e.checked)}
        />
        <label htmlFor="useToday" className="m-0">
          Usar fecha de hoy
        </label>
      </div>

      {!useToday && (
        <div className="mb-3">
          <label>Fecha</label>
          <Calendar
            value={customDate}
            onChange={(e) => setCustomDate(e.value)}
            showIcon
            dateFormat="dd/mm/yy"
            className="w-100"
          />
        </div>
      )}

      <div className="mb-3">
        <label>Prioridad</label>
        <Dropdown
          value={priority}
          options={priorities}
          onChange={(e) => setPriority(e.value)}
          placeholder="Seleccionar"
          className="w-100"
        />
      </div>

      <Button
        label="Guardar tarea"
        icon="pi pi-check"
        className="w-100"
        onClick={handleSubmit}
      />
    </Dialog>
  );
}
