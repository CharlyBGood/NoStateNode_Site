import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [logUser, setLogUser] = useState({
    email: "",
    password: "",
  });

  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState();

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
      setError("Por favor, completa todos los campos.");
    }

    try {
      await login(logUser.email, logUser.password);
      navigate("/Home");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("La contraseña no es válida.");
      } else if (error.code === "auth/user-not-found") {
        setError("El usuario no existe.");
      } else if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/internal-error"
      ) {
        setError("Proporciona un email válido.");
      } else {
        setError("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithGoogle();
      navigate("/Home");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="bg-black w-full max-w-xs m-auto">
      <form
        className="bg-black shadow-md rounded px-8 pt-6"
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
            className="bg-transparent shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            name="email"
            id="login-email"
            autoComplete="Your@Email.com"
            placeholder="youremail@example.com"
            onChange={handleChange}
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
            className="bg-transparent shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            name="password"
            id="login-password"
            onChange={handleChange}
            placeholder="******"
          />
        </div>

        <button className="log-btn w-100 border-none font-bold block border rounded mb-2 py-2 px-4 w-full">
          Iniciar sesión
        </button>
        <div className="mb-4 text-center">
          <Link
            to="/ResetPassword"
            href="#!"
            className="inline-block align-center font-bold text-sm"
          // onClick={handleResetPassword}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="mb-4">
          <button
            className="log-btn w-100 border-none font-bold text-sm block border rounded mb-2 py-2 px-4 w-full"
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
            className="log-btn py-1 outline-none border-none px-3 font-bold border rounded mb-2"
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
