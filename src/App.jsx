import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/layout"; // layout.jsx exporta por default
import Home from "@/pages/Home";
import CalendarView from "@/pages/Calendar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivateRoute from "@/components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout común con topbar */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarView />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
