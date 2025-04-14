import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
