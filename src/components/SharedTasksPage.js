import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Task from "../formPages/Task";
import TaskList from "../formPages/TaskList";
import "../stylesheets/TaskList.css";
import SharedRecipientsGrid from "./SharedRecipientsGrid";

export function SharedTasksPage() {
  const { userId } = useParams();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const recipient = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("recipient");
    return r ? decodeURIComponent(r) : null;
  }, [location.search]);

  useEffect(() => {
    if (loading || !user) return;

    const tasksRef = collection(db, "notes");
    const isOwner = user.uid === userId;

    let q;
    let filterFn = (arr) => arr;
    if (isOwner) {
      // Owner: si hay filtro por recipient, mostrar solo las notas correspondientes.
      // Soportar token especial "__private" para notas sin destinatarios (solo del dueño).
      if (recipient === "__private") {
        // Firestore no ofrece un filtro nativo para "array vacío" de forma fiable; traemos todas del owner y filtramos en cliente.
        q = query(tasksRef, where("userId", "==", userId));
        filterFn = (arr) => arr.filter((d) => !Array.isArray(d.shareWith) || d.shareWith.length === 0);
      } else if (recipient) {
        q = query(
          tasksRef,
          where("userId", "==", userId),
          where("shareWith", "array-contains", recipient)
        );
      } else {
        q = query(tasksRef, where("userId", "==", userId));
      }
    } else {
      // Invitado: sigue aplicando el filtro por su email (la página compartida para invitados no debe listar a otros destinatarios)
      q = query(
        tasksRef,
        where("userId", "==", userId),
        where("shareWith", "array-contains", user.email)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(filterFn(tasksData));
    });

    return () => unsubscribe();
  }, [userId, user, loading, recipient]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/Welcome");
    }
  }, [loading, user, navigate]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/Home');
    }
  };

  const isOwner = user && user.uid === userId;

  // Vista del dueño: si no hay filtro "recipient", mostrar tarjetas por destinatario
  if (isOwner && !recipient) {
    return (
      <div className="todo-list-main">
        <div className="back-btn-container">
          <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
        </div>
        <SharedRecipientsGrid notes={tasks} />
      </div>
    );
  }

  // Vista por lista filtrada o invitado
  if (isOwner && recipient) {
    // Dueño viendo una lista específica: reutiliza TaskList con filtro
    return (
      <div className="todo-list-main">
        <div className="back-btn-container">
          <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
        </div>
        <TaskList filterRecipient={recipient} />
      </div>
    );
  }

  // Invitado: render read-only de las tareas
  return (
    <div className="todo-list-main">
      <div className="back-btn-container">
        <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
      </div>
      <div className="task-list-container notes-link-container">
        {tasks.length === 0 && <p>No hay notas compartidas.</p>}
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            text={task.text}
            complete={task.complete}
            isReadOnly={true}
          />
        ))}
      </div>
    </div>
  );
}

export default SharedTasksPage;