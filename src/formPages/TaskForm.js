import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ShareButton } from "../components/ShareButton";
import SharedUserPicker from "../usersForm/SharedUserPicker";
import AddUserForm from "../usersForm/AddUserForm";
import { ConfirmationModal } from "../formPages/ConfirmationModal";

import "../stylesheets/TaskForm.css";

function TaskForm() {
  const [input, setInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalMessage, setModalMessage] = useState("");

  const handleUserSelected = (emails) => {
    setSelectedUsers(emails);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input) return;

    const user = auth.currentUser;
    if (user) {
      try {
        const newTask = {
          text: input,
          complete: false,
          userId: user.uid,
          shareWith: selectedUsers,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await addDoc(collection(db, "notes"), newTask);
        setInput("");
        setSelectedUsers([]);
        setModalMessage("Nota añadida con éxito.");
        setIsModalHidden(false);
      } catch (error) {
        console.error("Error adding task: ", error);
        setModalMessage("Error al añadir la nota.");
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
      <AddUserForm onContactAdded={() => setSelectedUsers([])} />
      <ShareButton />
      <SharedUserPicker onUserSelected={handleUserSelected} />
      <form id="form" className="task-form" onSubmit={handleSend}>
        <input
          className="task-input"
          type="text"
          placeholder="Añade una nota o enlace"
          value={input}
          name="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="task-btn">Agregar</button>
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