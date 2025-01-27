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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/Welcome"); // Redirect if user is not logged in
      return;
    }

    const tasksRef = collection(db, "notes");
    const q = query(
      tasksRef,
      where("userId", "==", userId), // Tasks owned by the user
      where("shareWith", "array-contains", user.email) // Tasks shared with the current user
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks: ", error);
        setError("Error al cargar las notas. Intenta nuevamente.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, user, navigate]);

  if (!user) {
    return null; // Redirect will handle this
  }

  if (loading) {
    return <p>Cargando notas...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <p>Nada para ver aquí. Asegúrate de tener el enlace correcto.</p>
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