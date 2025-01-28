import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
// import { useAuth } from "../context/AuthContext";
import Task from "../formPages/Task";
import "../stylesheets/TaskList.css";

export function SharedTasksPage() {
  const { userId } = useParams();
  const user  = auth.currentUser;
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      // navigate("/Welcome"); 
      alert("you are not " + user)
      return;
    }

    const fetchTasks = () => {
      const tasksRef = collection(db, "notes");
      const q = query(tasksRef, where("userId", "==", userId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((task) => Array.isArray(task.shareWith) && task.shareWith.includes(user.email));
        setTasks(tasksData);
      });

      return unsubscribe;
    };

    let unsubscribe;
    if (user.email) {
      unsubscribe = fetchTasks();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, user, navigate]);

  return (
    <div className="task-list-container">
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