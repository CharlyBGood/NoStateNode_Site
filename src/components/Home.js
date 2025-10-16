import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../formPages/TaskForm";
import OwnerRecipientsDashboard from "./OwnerRecipientsDashboard";
import "../App.css"
import "../stylesheets/Home.css";

export function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <h1>Cargando....</h1>;
  }

  return (
    <div className="todo-list-main">
      <div className="user-info">
        {/* <img src={user.photoURL} alt="user pic" /> */}
        <h1 className="title-description">
          ¡Hola {user.displayName || user.email}!
        </h1>
      </div>
      <p className="text-center text-sm py-2">¡Comienza añadiendo notas, enlaces, información o recursos!</p>
      <p className="text-center text-sm py-2">Añade contactos con su e-mail y comparte el link a la lista de notas. No te preocupes, no podrán editarla.</p>
      <TaskForm />
      <OwnerRecipientsDashboard />
    </div>
  );
}
