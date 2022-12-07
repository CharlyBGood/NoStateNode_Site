import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskList from "../formPages/TaskList";
import "../App.css"

export function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (!user) {
    navigate("/");
  }

  return (
    <div className="todo-list-main">
      <h1 className="title-description">
        ¡Hola {user.displayName || user.email}!
      </h1>
      <p className="text-center text-sm py-2">¡Puedes comenzar añadiendo una lista de ideas, un recurso como enlace, o algún tipo de resúmen descriptivo. 
        Luego podrás compartir dicha información con otros contactos.
      </p>
      <TaskList />
    </div>
  );
}
