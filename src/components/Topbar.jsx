import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { useAuth } from "@/context/AuthContext";
import UserSettingsModal from "@/components/UserSettingsModal";

export default function Topbar({ setModalVisible }) {
  const { user, logout } = useAuth();
  const op = useRef(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <div className="topbar d-flex justify-content-between align-items-center px-3">
      <h1 className="fw-bold m-0 fs-4">usTasks</h1>

      {user && (
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-primary px-2 py-1"
            title="Nueva tarea"
            onClick={() => setModalVisible(true)}
          >
            <i className="pi pi-plus" />
          </button>

          <img
            src={user.photoURL || "https://placehold.co/32x32?text=👤"}
            alt="Avatar"
            className="rounded-circle"
            style={{ width: 32, height: 32, objectFit: "cover" }}
          />

          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-text p-0"
            onClick={(e) => op.current.toggle(e)}
            aria-haspopup
            aria-controls="user_menu"
          />

          <OverlayPanel ref={op} id="user_menu">
            <div
              className="d-flex flex-column gap-2"
              style={{ minWidth: "150px" }}
            >
              <button
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={() => {
                  op.current.hide();
                  setSettingsVisible(true);
                }}
              >
                Configuración
              </button>

              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={logout}
              >
                Logout
              </button>
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
