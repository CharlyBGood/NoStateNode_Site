import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";
import { LoginButton } from "./LoginButton";

export function Register() {
  const { signup, user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ email: "", password: "", });
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/Home");
    }
  }, [user, loading, navigate]);

  const handleChange = ({ target: { name, value } }) =>
    setNewUser({ ...newUser, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newUser.email || !newUser.password) {
      setError("Por favor, completa ambos campos del formulario.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(newUser.email, newUser.password);
      navigate("/Home");
    } catch (error) {
      if (
        error.code === "auth/internal-error" ||
        error.code === "auth/invalid-email"
      ) {
        setError(
          "¡Debes completar ambos campos del formulario, y la información debe ser válida!"
        );
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("El e-amil proporcionado ya tiene una cuenta existente.");
      } else {
        setError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
      }
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
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
        className="bg-black shadow-md rounded-xs px-8 pt-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-sm font-fold mb-2"
            htmlFor="register-email"
          >
            E-mail
          </label>
          <input
            className="bg-transparent shadow-xs appearance-none border border-gray-700 rounded-xs w-full py-2 px-3 leading-tight focus:outline-hidden"
            type="email"
            name="email"
            id="register-email"
            value={newUser.email}
            autoComplete="Your@Email.com"
            placeholder="youremail@example.com"
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-fold mb-2"
            htmlFor="register-password"
          >
            Contraseña
          </label>
          <input
            className="bg-transparent shadow-xs appearance-none border border-gray-700 rounded-xs w-full py-2 px-3 leading-tight focus:outline-hidden"
            type="password"
            name="password"
            placeholder="******"
            id="register-password"
            value={newUser.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
  <button className="log-btn border-0 font-bold block rounded-xs mb-2 py-2 px-4 w-full">
          Crear cuenta
        </button>
        <div className="mb-4  py-2"></div>
        <div className="mb-4">
          <button
            className="log-btn border-0 font-bold text-sm block rounded-xs mb-2 py-2 px-4 w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar con Google"}
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <p className="mb-2">
            ¿Ya tienes cuenta?
          </p>
          <LoginButton />
        </div>
      </form>
      {error && <Alert message={error} />}
    </div>
  );
}
