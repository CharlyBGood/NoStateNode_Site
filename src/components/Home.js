import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../formPages/TaskForm";
import OwnerRecipientsDashboard from "./OwnerRecipientsDashboard";
import AddUserForm from "../usersForm/AddUserForm";
import SharedUserPicker from "../usersForm/SharedUserPicker";
import { ShareButton } from "./ShareButton";
import "../App.css"
import "../stylesheets/Home.css";

export function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);

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
          ¡Hola {(
            user?.displayName
              ? user.displayName.trim().split(/\s+/)[0]
              : user?.email
          )}!
        </h1>
      </div>
      <div className="home-grid">
        {/* Columna izquierda: intro + crear nota + compartir lista */}
        <section className="home-left">
          <p className="text-center text-sm py-2">
            Podrás agregar notas, enlaces o recursos
          </p>
          <TaskForm
            selectedUsers={selectedUsers}
            onClearSelectedUsers={() => setSelectedUsers([])}
          />
          <div className="share-btn-container">
            <ShareButton />
          </div>
        </section>

        {/* Columna derecha: añadir contacto + selector + tarjetas compartidas */}
        <section className="home-right">
          <p className="text-center text-sm py-2">
            Añade contactos para que puedan compartir una lista.
          </p>
          <AddUserForm onContactAdded={() => setSelectedUsers([])} />
          <div className="user-select-wrapper">
            <SharedUserPicker onUserSelected={setSelectedUsers} />
          </div>
        </section>
        <section className="home-bottom">
          <OwnerRecipientsDashboard />
        </section>
      </div>
    </div>
  );
}
