import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export function Register() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleChange = ({ target: { name, value } }) =>
    setUser({ ...user, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(user.email, user.password);
      navigate("/Home");
    } catch (error) {
      if (
        error.code === "auth/internal-error" ||
        error.code === "auth/invalid-email"
      ) {
        setError(
          "¡Debes completar ambos campos del formulario, y la información debe ser válida!"
        );
      }
      if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("El correo proporcionado ya tiene una cuenta existente.");
      }
      console.error(error.message);
    }
  };

  return (
    <div className="bg-black w-full max-w-xs m-auto">
      <form
        className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-orange-300 text-sm font-fold mb-2"
            htmlFor="email"
          >
            Correo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            name="email"
            id="email"
            autoComplete="Your@Email.com"
            placeholder="youremail@example.com"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-orange-300 text-sm font-fold mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            placeholder="******"
          />
        </div>
        <button className="bg-orange-600 hover:bg-slate-400 w-100 border-none text-black font-bold block border rounded mb-2 py-2 px-4 w-full">
          Crear cuenta
        </button>
        <p className="my-4 text-sm flex justify-between">
          ¿Ya tienes cuenta?
          <Link
            className="bg-orange-600 py-1 outline-none hover:bg-slate-400 border-none px-3 text-black font-bold border rounded mb-2"
            to="/login"
          >
            Ingresar
          </Link>
        </p>
      </form>
      {error && <Alert message={error} />}
    </div>
  );
}
