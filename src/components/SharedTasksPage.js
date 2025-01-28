import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const SharedTasksPage = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/Welcome"); 
      return;
    }

    const tasksRef = collection(db, "notes");
    const q = query(tasksRef, where("shareWith", "array-contains", user.email), where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      },
      (err) => {
        console.error(err);
        setError("Error al cargar las notas compartidas.");
      }
    );

    return () => unsubscribe();
  }, [user, userId, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Shared Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SharedTasksPage;