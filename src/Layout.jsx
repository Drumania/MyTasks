import { useState } from "react";
import Topbar from "@/components/Topbar";
import TaskFormModal from "@/components/TaskFormModal";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="container-fluid vh-100 overflow-hidden">
      <div className="row h-100">
        <div className="col-12 d-flex flex-column p-0 content-area">
          <div className="topbar">
            <Topbar setModalVisible={setModalVisible} />
          </div>
          <main className="flex-grow-1 scroll-mac p-3">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal global para tareas */}
      <TaskFormModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      />
    </div>
  );
}
