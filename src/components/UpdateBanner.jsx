import { useState } from "react";
import { registerSW } from "virtual:pwa-register";

export default function UpdateBanner() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
  });

  return (
    <div className={`update-banner ${needRefresh ? "show" : ""}`}>
      <span>Hay una nueva versión disponible.</span>
      <button
        className="btn-new ms-2"
        onClick={() => updateServiceWorker(true)}
      >
        Actualizar
      </button>
    </div>
  );
}
