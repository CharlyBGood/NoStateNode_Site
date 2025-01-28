import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Alert } from "./Alert";

export function ResetPassword() {
  const [user, setUser] = useState({
    email: "",
  });


  const { resetPassword } = useAuth();  
  const [error, setError] = useState();

  const handleChange = ({ target: { name, value } }) =>
    setUser({ ...user, [name]: value });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!user.email) return setError("Por favor ingresa tu email.");
    try {
      await resetPassword(user.email);
        
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
          <p className="my-4 text-sm flex justify-between">
            Enviaremos un correo para reestablecer la constraseña.
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-fold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="bg-transparent shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            name="email"
            id="email"
            autoComplete="Your@Email.com"
            placeholder="youremail@example.com"
            onChange={handleChange}
          />
        </div>

        <button className="log-btn w-100 border-none font-bold block border rounded mb-2 py-2 px-4 w-full" type="submit">
          Cambiar Contraseña
        </button>
        <div className="mb-4 flex items-center">
          <p className="my-4 text-sm flex justify-between">
            ¿No tienes cuenta?
          </p>
          <Link
            className="log-btn py-1 outline-none border-none px-3 font-bold border rounded mb-2"
            to="/register"
          >
            Registrarse
          </Link>
        </div>
        <div className="mb-4">
          <p className="my-4 text-sm flex justify-between">
            <Link
              className="w-full py-1 outline-none hover:text-orange-200 border-none text-center font-bold border rounded mb-2 "
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
