import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ShareButton } from "../components/ShareButton";
import SharedUserPicker from "../usersForm/SharedUserPicker";
import AddUserForm from "../usersForm/AddUserForm";
import "../stylesheets/TaskForm.css";

function TaskForm() {
  const [input, setInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

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
        alert("Nota añadida con éxito.");
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    } else {
      console.error("User is not logged in.");
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
    </>
  );
}

export default TaskForm;