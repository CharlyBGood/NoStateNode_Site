import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      navigate("/");
    } catch (error) {
      if (error.code === "auth/internal-error") {
        setError("Correo inválido");
      }
      if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("El correo proporcionado ya tiene una cuenta existente.");
      }
      // setError(error.message);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="youremail@example.com"
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
          placeholder="******"
        />

        <button>Register</button>
      </form>
    </div>
  );
}
