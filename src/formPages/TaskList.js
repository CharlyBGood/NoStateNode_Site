import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import "../stylesheets/TaskList.css";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);

      if (user) {
        const tasksRef = collection(db, "notes");
        const tasksQuery = query(tasksRef, where("userId", "==", user.uid));
        const unsuscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        });

        return unsuscribeTasks;
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // const addTask = async (task) => {
  //   if (task.text.trim()) {
  //     task.text = task.text.trim();
  //     const user = auth.currentUser;
  //     if (user) {
  //       const taskRef = db.collection("notes").doc();
  //       await taskRef.set({
  //         text: task.text,
  //         complete: false,
  //         userId: user.uid,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       });
  //     }
  //   }
  // };

  const deleteTask = async (id) => {
    if (window.confirm("Quieres borrar esta entrada?")) {
      try {
        const taskRef = doc(db, "notes", id);
        await deleteDoc(taskRef);
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  const completeTask = async (id) => {
    try {
      const taskRef = doc(db, "notes", id);
      const taskSnap = await getDoc(taskRef);

      if (taskSnap.exists()) {
        await updateDoc(taskRef, {
          complete: !taskSnap.data().complete,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <>
      {/* ... Authentication components (if needed) ... */}
      {user ? (
        <>
          <TaskForm />
          <div className="task-list-container">
            {tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                text={task.text}
                complete={task.complete}
                completeTask={completeTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Por favor, inicia sesión para acceder a tus tareas.</p>
      )}
    </>
  );
}

export default TaskList;
