import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { ConfirmationModal } from "./ConfirmationModal";
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
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      let unsuscribeTasks = null;

      if (user) {
        const tasksRef = collection(db, "notes");
        const tasksQuery = query(tasksRef, where("userId", "==", user.uid));

        unsuscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        });
      } else {
        setTasks([]);
      }

      return () => {
        if (unsuscribeTasks) {
          unsuscribeTasks();
        }
      }

    });
    return () => unsubscribeAuth();
  }, []);

  const deleteTask = (id) => {
    setTaskToDelete(id);
    setIsModalHidden(false);
  };

  const cancelDelete = () => {
    setIsModalHidden(true);
  }

  const confirmDelete = async () => {
    try {
      const taskRef = doc(db, "notes", taskToDelete);
      await deleteDoc(taskRef);
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
    setIsModalHidden(true);
    setTaskToDelete(null);
  }

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
          <ConfirmationModal
            onDeleteCancel={cancelDelete}
            onDeleteConfirm={confirmDelete}
            isHidden={isModalHidden}
            modalTitle="¿Estás seguro de que deseas eliminar esta tarea?"
            buttonOneText="Eliminar"
            buttonTwoText="Cancelar"
          />
        </>
      ) : (
        <p>Por favor, inicia sesión para acceder a tus tareas.</p>
      )}
    </>
  );
}

export default TaskList;
