import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export function Login() {
  const { user, loading, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [logUser, setLogUser] = useState({ email: "", password: "" });
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/Home");
    }
  }, [user, loading, navigate]);

  const handleChange = ({ target: { name, value } }) =>
    setLogUser({ ...logUser, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!logUser.email.trim() || !logUser.password.trim()) {
      setError("Por favor, completa ambos campos del formulario.");
      return;
    }

    setIsLoading(true);
    try {
      await login(logUser.email, logUser.password);
      navigate("/Home");
    } catch (error) {
      console.error("Login error code:", error.code); // Log the error code for debugging
      if (error.code === "auth/wrong-password") {
        setError("La contraseña no es válida.");
      } else if (error.code === "auth/user-not-found") {
        setError("El usuario no existe.");
      } else if (error.code === "auth/invalid-email" || error.code === "auth/internal-error") {
        setError("Proporciona un email válido.");
      } else {
        setError("Ocurrió un error inesperado. Intenta nuevamente.");
      }
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate("/Home");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
        setError("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <h1>Cargando...</h1>;

  return (
    <div className="bg-black w-full max-w-xs m-auto">
      <form
        className="bg-black shadow-md rounded-sm px-8 pt-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-sm font-fold mb-2"
            htmlFor="login-email"
          >
            E-mail
          </label>
            <input
              className="bg-transparent shadow-sm appearance-none border border-gray-700 rounded-sm w-full py-2 px-3 leading-tight focus:outline-none"
            type="email"
            name="email"
            id="login-email"
            autoComplete="Your@Email.com"
            placeholder="youremail@example.com"
            value={logUser.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-fold mb-2"
            htmlFor="login-password"
          >
            Contraseña
          </label>
            <input
              className="bg-transparent shadow-sm appearance-none border border-gray-700 rounded-sm w-full py-2 px-3 leading-tight focus:outline-none"
            type="password"
            name="password"
            id="login-password"
            placeholder="******"
            value={logUser.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
            className="log-btn border-0 font-bold block rounded-sm mb-2 py-2 px-4 w-full">
          {isLoading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <div className="mb-4 text-center">
          <Link
            to="/ResetPassword"
            href="#!"
            className="inline-block font-bold text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="mb-4">
          <button
              className="log-btn border-0 font-bold text-sm block rounded-sm mb-2 py-2 px-4 w-full"
            onClick={handleGoogleLogin}
          >
            Ingresar con Google
          </button>
        </div>
        <div className="mb-4 flex items-center">
          <p className="mb-2">
            ¿No tienes cuenta?
          </p>
          <Link
              className="log-btn py-1 outline-none border-0 px-3 font-bold rounded-sm mb-2"
            to="/register"
          >
            Registrarse
          </Link>
        </div>
      </form>
      {error && <Alert message={error} />}
    </div>
  );
}
