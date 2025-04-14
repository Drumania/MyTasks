import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // después de un pequeño delay, agregamos clase para animar fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 500); // podés ajustar este tiempo

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`splash-screen d-flex justify-content-center align-items-center bg-white ${
        fadeOut ? "fade-out" : ""
      }`}
    >
      <div className="text-center">
        <img
          src="/logo.png"
          alt="usTasks"
          style={{ width: 80, marginBottom: 20 }}
        />
      </div>
    </div>
  );
}
