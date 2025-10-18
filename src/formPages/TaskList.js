import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { ConfirmationModal } from "./ConfirmationModal";
import "../stylesheets/TaskList.css";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDoc, orderBy } from "firebase/firestore";
import ShareButton from "../components/ShareButton";


function TaskList({ filterRecipient, isReadOnly = false, ownerId }) {
  console.log('[TaskList] ownerId:', ownerId, 'filterRecipient:', filterRecipient, 'isReadOnly:', isReadOnly);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    let unsubscribeTasks = null;
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (unsubscribeTasks) {
        unsubscribeTasks();
        unsubscribeTasks = null;
      }
      setUser(currentUser);
      if (currentUser) {
        const tasksRef = collection(db, "notes");
        let tasksQuery;
        if (isReadOnly) {
          // Invitado: ver solo notas donde su email está en shareWith Y userId == ownerId
          if (!ownerId) {
            setTasks([]);
            return;
          }
          tasksQuery = query(
            tasksRef,
            where("userId", "==", ownerId),
            where("shareWith", "array-contains", filterRecipient),
            orderBy("createdAt", "desc")
          );
        } else {
          // Owner: ver notas propias filtradas por destinatario
          tasksQuery = query(tasksRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
        }
        unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
          let tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (!isReadOnly && filterRecipient) {
            if (filterRecipient === "__private") {
              tasksData = tasksData.filter(
                (t) => !Array.isArray(t.shareWith) || t.shareWith.length === 0
              );
            } else {
              tasksData = tasksData.filter(
                (t) => Array.isArray(t.shareWith) && t.shareWith.includes(filterRecipient)
              );
            }
          }
          setTasks(tasksData);
        });
      } else {
        setTasks([]);
      }
    });
    return () => {
      if (unsubscribeTasks) unsubscribeTasks();
      unsubscribeAuth();
    };
  }, [filterRecipient, isReadOnly, ownerId]);

  const deleteTask = (id) => {
    setTaskToDelete(id);
    setIsModalHidden(false);
  };

  const cancelDelete = () => {
    setIsModalHidden(true);
  };

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
      {user ? (
        <>
          {!isReadOnly && (
            <TaskForm
              selectedUsers={filterRecipient === "__private" ? [] : filterRecipient ? [filterRecipient] : []}
              hideRecipientSelector={!!filterRecipient}
            />
          )}
          <div className="task-list-container">
            {tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                text={task.text}
                complete={task.complete}
                createdAt={task.createdAt}
                shareWith={task.shareWith}
                ownerId={user?.uid}
                completeTask={isReadOnly ? undefined : completeTask}
                deleteTask={isReadOnly ? undefined : deleteTask}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
          {/* Mostrar botón de compartir solo si es una lista filtrada (no dashboard ni privado) */}
          {!isReadOnly && filterRecipient && filterRecipient !== "__private" && (
            <ShareButton 
              mode="lista" 
              userId={user?.uid} 
              listId={filterRecipient}
            />
          )}
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
