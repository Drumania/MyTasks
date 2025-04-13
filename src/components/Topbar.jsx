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
          <div className="dots pe-3">
            <i className="pi pi-calendar"></i>
          </div>

          <button
            className="btn btn-sm btn-new px-2 py-1"
            title="Nueva tarea"
            onClick={() => setModalVisible(true)}
          >
            <i className="pi pi-plus" />
          </button>
          {/*
           */}

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
                <br />
              </div>

              <span
                className="w-100 py-3 "
                onClick={() => {
                  op.current.hide();
                  setSettingsVisible(true);
                }}
              >
                Configuración
              </span>

              <span className="w-100 py-3 text-danger" onClick={logout}>
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
