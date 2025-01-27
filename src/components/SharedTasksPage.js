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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      return;
    }
    const tasksRef = collection(db, "notes");
    const q = query(tasksRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
        .filter((task) => task.sharedWith.includes(user.email));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [userId, user]);

  if (!user) {
    navigate("/Welcome");
  }

  return (
    <div className="task-list-container">
      {tasks.length === 0 && <p>Nada para ver aquí. Asegurate de tener el enlace correcto.</p>}
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