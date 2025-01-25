import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Task from "../formPages/Task";
import "../stylesheets/ShareModal.css";

export function SharedTasksPage() {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = collection(db, "notes");
    const q = query(tasksRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="shared-tasks-container">
      <h1>Shared Tasks</h1>
      <div className="task-list">
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