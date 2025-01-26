import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskList from "../formPages/TaskList";
import "../App.css"
import "../stylesheets/Home.css";

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
      <div className="user-info">
        {/* <img src={user.photoURL} alt="user pic" /> */}
        <h1 className="title-description">
          ¡Hola {user.displayName || user.email}!
        </h1>
      </div>
      <p className="text-center text-sm py-2">¡Puedes comenzar añadiendo textos, enlaces, o cualquier tipo de información.
        Comparte la lista con otr@s usuari@s, a través de su e-mail.
      </p>
      <TaskList />
    </div>
  );
}
