import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Task from "../formPages/Task";
import "../stylesheets/TaskList.css";

export function SharedTasksPage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/Welcome");
      return;
    };

    const taskRef = collection(db, "notes");
    const q = query(
      taskRef,
      where("userId", "==", userId),
      where("shareWith", "array-contains", user.email)
    );

    const unsusscribe = onSnapshot(
      q,
      (snapshot) => {
        const taskData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskData);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setError("Error al cargar las notas. Intenta otra vez.");
        setLoading(false);
      }
    );

    return unsusscribe();
  }, [userId, user, navigate]);

  if (!user) navigate("/Welcome");

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <p>Nada para ver aquí. Asegurate de tener el enlace correcto.</p>
      ) : (
        tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            text={task.text}
            complete={task.complete}
            isReadOnly={true}
          />
        ))
      )}
    </div>
  );
}