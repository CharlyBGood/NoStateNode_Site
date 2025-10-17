import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ConfirmationModal } from "../formPages/ConfirmationModal";
import "../stylesheets/TaskForm.css";

function TaskForm({ selectedUsers = [], onClearSelectedUsers }) {
  const [input, setInput] = useState("");
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input) return;

    const user = auth.currentUser;
    if (user) {
      setIsLoading(true);
      try {
        const newTask = {
          text: input,
          complete: false,
          userId: user.uid,
          shareWith: selectedUsers,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await addDoc(collection(db, "notes"), newTask);
        setInput("");
        onClearSelectedUsers && onClearSelectedUsers();
        setModalMessage("Nota añadida con éxito.");
      } catch (error) {
        console.error("Error adding task: ", error);
        setModalMessage("Error al añadir la nota.");
      } finally {
        setIsLoading(false);
        setIsModalHidden(false);
      }
    } else {
      console.error("User is not logged in.");
      setModalMessage("El usuario no ha iniciado sesión.");
      setIsModalHidden(false);
    }
  };

  return (
    <>
      <form id="form" className="task-form" onSubmit={handleSend}>
        <input
          className="task-input"
          type="text"
          id="task-input"
          placeholder="Añade una nota o enlace"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="log-btn border-none border rounded py-1 px-3" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir"}
        </button>
      </form>
      <ConfirmationModal
        isHidden={isModalHidden}
        onDeleteCancel={() => setIsModalHidden(true)}
        onDeleteConfirm={() => setIsModalHidden(true)}
        modalTitle={modalMessage}
        buttonOneText="Cerrar"
        buttonTwoText=""
      />
    </>
  );
}

export default TaskForm;