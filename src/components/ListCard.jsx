import { Checkbox } from "primereact/checkbox";
import { Avatar } from "primereact/avatar";
import { formatDate } from "@/utils/formatDate";

export default function ListCard({
  taskId,
  title,
  date,
  priority = "media",
  assignedTo,
  completed,
  onToggle,
  onMoveToTomorrow,
}) {
  const getPriorityBadge = () => {
    switch (priority) {
      case "alta":
        return <span className="badge bg-high">&nbsp;</span>;
      case "media":
        return <span className="badge bg-medium text-dark">&nbsp;</span>;
      case "baja":
        return <span className="badge bg-low">&nbsp;</span>;
      default:
        return null;
    }
  };

  const getAvatar = () => {
    if (!assignedTo) return null;
    return (
      <Avatar
        label={assignedTo.charAt(0).toUpperCase()}
        shape="circle"
        style={{ backgroundColor: "#0d6efd", color: "#fff" }}
        size="small"
        className="me-2"
      />
    );
  };

  return (
    <div
      className={`d-flex justify-content-between align-items-center px-3 py-2 rounded ${
        completed ? "bg-light text-muted" : "bg-white"
      }`}
    >
      {/* Left: check + title */}
      <div className="d-flex align-items-center gap-2">
        <i
          className={`pi ${
            completed
              ? "pi-check-circle check-success"
              : "pi-circle check-stand"
          }`}
          style={{ fontSize: "1.2rem", cursor: "pointer" }}
          onClick={() => onToggle(taskId, !completed)}
          title={completed ? "Tarea completada" : "Marcar como completada"}
        />
        <span className="fw-normal">{title}</span>
      </div>

      {/* Right: metadata + controls */}
      <div className="d-flex align-items-center gap-2">
        <div className="d-flex flex-column align-items-center">
          {onMoveToTomorrow && (
            <span
              className="btn btn-sm  "
              title="Mover a mañana"
              onClick={onMoveToTomorrow}
            >
              <i className="pi pi-angle-double-right" title="Mover a mañana" />
            </span>
          )}
        </div>

        {getAvatar()}
        {getPriorityBadge()}
      </div>
    </div>
  );
}
