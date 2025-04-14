import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/Layout"; // layout.jsx exporta por default
import Home from "@/pages/Home";
import CalendarView from "@/pages/Calendar";
import PrivateRoute from "@/components/PrivateRoute";
import AuthPage from "@/components/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout común con topbar */}
        <Route path="/auth" element={<AuthPage />} />
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
      </Routes>
    </Router>
  );
}

export default App;
