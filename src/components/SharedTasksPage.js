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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/Welcome"); // Redirect if user is not logged in
      return;
    }

    const tasksRef = collection(db, "notes");
    const q = query(tasksRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((task) => task.shareWith.includes(user.email)); // Filter notes by shared user
        setTasks(tasksData);
      },
      (err) => {
        console.error(err);
        setError("Error al cargar las notas compartidas.");
      }
    );

    return () => unsubscribe();
  }, [userId, user, navigate]);

  return (
    <div className="task-list-container">
      {error && <p className="error">{error}</p>}
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
  );
}