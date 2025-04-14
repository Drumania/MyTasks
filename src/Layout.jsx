import { useState } from "react";
import Topbar from "@/components/Topbar";
import TaskFormModal from "@/components/TaskFormModal";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 g-0">
          <div className="topbar">
            <Topbar setModalVisible={setModalVisible} />
          </div>
          <main className="scroll-mac p-3">
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
