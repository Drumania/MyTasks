export default function ListCard({
  taskId,
  title,
  date,
  priority = "media",
  assignedTo,
  completed,
  onToggle,
  onMoveToTomorrow,
  isFadingOut = false, // 👈 nuevo prop
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

  return (
    <div
      className={`d-flex justify-content-between align-items-center px-3 py-2 rounded transition-task 
        ${completed ? "bg-light text-muted" : "bg-white"} 
        ${isFadingOut ? "task-fade" : ""}
      `}
    >
      <div className="d-flex align-items-center gap-2">
        <i
          className={`pi ${
            completed
              ? "pi-check-circle check-success"
              : "pi-circle check-stand"
          }`}
          style={{ fontSize: "1.2rem", cursor: "pointer" }}
          onClick={() => onToggle(taskId, !completed)}
        />
        <span className="fw-normal">{title}</span>
      </div>

      <div className="d-flex align-items-center gap-2">
        {onMoveToTomorrow && !completed && (
          <span className="btn btn-sm" onClick={onMoveToTomorrow}>
            <i className="pi pi-angle-double-right" />
          </span>
        )}
        {getPriorityBadge()}
      </div>
    </div>
  );
}
