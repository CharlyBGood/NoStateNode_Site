import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Task from "../formPages/Task";
import "../stylesheets/TaskList.css";

export function SharedTasksPage() {
  const { userId } = useParams();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    const tasksRef = collection(db, "notes");
    const isOwner = user.uid === userId;

    const q = isOwner
      ? query(tasksRef, where("userId", "==", userId))
      : query(
          tasksRef,
          where("userId", "==", userId),
          where("shareWith", "array-contains", user.email)
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [userId, user, loading]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/Welcome");
    }
  }, [loading, user, navigate]);

  return (
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
  );
}

export default SharedTasksPage;