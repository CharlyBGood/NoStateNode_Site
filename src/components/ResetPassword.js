import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export function ResetPassword() {
  const [user, setUser] = useState({
    email: "",
  });

  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleChange = ({ target: { name, value } }) =>
    setUser({ ...user, [name]: value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setError(error.message);
  // };

  const handleResetPassword = async () => {
    if (!user.email) return setError("Por favor ingresa tu email.");
    try {
      await resetPassword(user.email);
      alert(
        "¡Hemos enviado un correo con un enlace para resetear tu contraseña!"
      );
      navigate("/Welcome");
      setError(
        "¡Hemos enviado un correo con un enlace para resetear tu contraseña!"
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-black w-full max-w-xs m-auto">
      {error && <Alert message={error} />}

      <form
        className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleResetPassword}
      >
        <div className="mb-4">
          <p className="my-4 text-sm text-orange-300 flex justify-between">
            Enviaremos un correo para reestablecer la constraseña.
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-orange-300 text-sm font-fold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            name="email"
            placeholder="youremail@example.com"
            onChange={handleChange}
          />
        </div>

        <button className="bg-orange-600 hover:bg-orange-400 w-100 border-none text-black font-bold block border rounded mb-2 py-2 px-4 w-full">
          Reset Password
        </button>
        <div className="mb-4 flex items-center">
          <p className="my-4 text-sm text-orange-300 flex justify-between">
            ¿No tienes cuenta?
          </p>
          <Link
            className="bg-orange-600 py-1 outline-none hover:bg-orange-400 border-none px-3 text-black font-bold border rounded mb-2"
            to="/register"
          >
            Registrarse
          </Link>
        </div>
        <div className="mb-4">
          <p className="my-4 text-sm flex justify-between">
            <Link
              className="w-full text-orange-300 py-1 outline-none hover:text-orange-200 border-none text-center font-bold border rounded mb-2 "
              to="/login"
            >
              Volver a Inicio
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
