import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/components/SplashScreen";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      alert("Error con Google: " + err.message);
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-4 text-center">
        {isLogin ? "Iniciar sesión" : "Crear cuenta"}
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-3"
          required
        />

        <button
          className={`btn w-100 ${isLogin ? "btn-success" : "btn-primary"}`}
          type="submit"
        >
          {isLogin ? "Ingresar" : "Registrarme"}
        </button>

        {isLogin && (
          <button
            type="button"
            className="btn btn-outline-danger w-100 mt-3"
            onClick={handleGoogleLogin}
          >
            <i className="pi pi-google me-2" />
            Ingresar con Google
          </button>
        )}
      </form>

      <div className="text-center mt-3">
        <small>
          {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            className="btn btn-link btn-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Registrate" : "Iniciar sesión"}
          </button>
        </small>
      </div>
    </div>
  );
}
