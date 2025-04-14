import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserSettingsModal from "@/components/UserSettingsModal";

export default function Topbar({ setModalVisible }) {
  const { user, logout } = useAuth();
  const op = useRef(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <div className="topbar topbar-blur d-flex justify-content-between align-items-center px-3">
      <h1 className="fw-bold m-0 fs-4">usTasks</h1>

      {user && (
        <div className="d-flex align-items-center gap-3">
          {/* Navegación */}
          <NavLink
            to="/"
            className={({ isActive }) => `nav-icon ${isActive ? "active" : ""}`}
            title="Lista"
          >
            <i className="pi pi-list"></i>
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) => `nav-icon ${isActive ? "active" : ""}`}
            title="Calendario"
          >
            <i className="pi pi-calendar"></i>
          </NavLink>

          {/* Nueva tarea */}
          <button
            className="btn btn-sm btn-new px-2 py-1"
            title="Nueva tarea"
            onClick={() => setModalVisible(true)}
          >
            <i className="pi pi-plus" />
          </button>

          {/* Menú usuario */}
          <div className="dots" onClick={(e) => op.current.toggle(e)}>
            <i className="pi pi-ellipsis-v"></i>
          </div>

          <OverlayPanel ref={op} id="user_menu">
            <div
              className="d-flex flex-column gap-2"
              style={{ minWidth: "150px" }}
            >
              <div className="pb-3 mb-2 border-bottom">
                <img
                  src={user.photoURL || "https://placehold.co/32x32?text=👤"}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: 32, height: 32, objectFit: "cover" }}
                />
                <span> {user.displayName} </span>
              </div>

              <span
                className="w-100 py-2"
                onClick={() => {
                  op.current.hide();
                  setSettingsVisible(true);
                }}
              >
                Configuración
              </span>

              <span className="w-100 py-2 text-danger" onClick={logout}>
                Logout
              </span>
            </div>
          </OverlayPanel>
        </div>
      )}

      <UserSettingsModal
        visible={settingsVisible}
        onHide={() => setSettingsVisible(false)}
      />
    </div>
  );
}
