import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Task from "../formPages/Task";
import "../stylesheets/TaskList.css";

export function SharedTasksPage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      return;
    }

    const fetchOwner = async () => {
      try {
        const ownerDoc = await getDoc(doc(db, "users", userId));
        if (ownerDoc.exists()) {
          setOwner(ownerDoc.data());
        } else {
          setError("Owner not found");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching owner information");
      }
    };

    fetchOwner();

    const tasksRef = collection(db, "notes");
    const q = query(tasksRef, where("userId", "==", userId), where("shareWith", "array-contains", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [userId, user]);

  if (!user) {
    navigate("/Welcome");
  }

  return (
    <div className="task-list-container notes-link-container">
      {error && <p className="error-message">{error}</p>}
      {tasks.length === 0 && <p>No hay notas compartidas.</p>}
      {owner && <p className="text-center text-sm py-2">Estos son los recursos que {owner.email} compartió contigo:</p>}
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