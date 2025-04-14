import { SwipeableList, SwipeableListItem } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
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
  onEdit,
  onDelete,
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

  const content = (
    <div
      className={`d-flex justify-content-between align-items-center px-3 py-2 rounded ${
        completed ? "bg-light text-muted" : "bg-white"
      }`}
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
        {onMoveToTomorrow && (
          <span
            className="btn btn-sm"
            title="Mover a mañana"
            onClick={onMoveToTomorrow}
          >
            <i className="pi pi-angle-double-right" />
          </span>
        )}
        {getAvatar()}
        {getPriorityBadge()}
      </div>
    </div>
  );

  return (
    <SwipeableList threshold={0.25}>
      <SwipeableListItem
        swipeLeft={{
          content: (
            <div className="swipe-action bg-danger text-white d-flex justify-content-end align-items-center px-3">
              <button
                className="btn btn-sm btn-light"
                onClick={() => onDelete(taskId)}
              >
                <i className="pi pi-trash" />
              </button>
            </div>
          ),
        }}
        swipeRight={{
          content: (
            <div className="swipe-action bg-warning text-dark d-flex justify-content-start align-items-center px-3">
              <button
                className="btn btn-sm btn-dark"
                onClick={() => onEdit(taskId)}
              >
                <i className="pi pi-pencil" />
              </button>
            </div>
          ),
        }}
      >
        {content}
      </SwipeableListItem>
    </SwipeableList>
  );
}
