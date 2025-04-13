import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import UpdateBanner from "@/components/UpdateBanner";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UpdateBanner />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
