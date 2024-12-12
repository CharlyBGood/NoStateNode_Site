// import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

import "../stylesheets/TaskForm.css";

function TaskForm() {
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      try {
        const newTask = {
          text: input,
          complete: false,
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await addDoc(collection(db, "notes"), newTask);
        setInput("");
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    } else {
      console.error("User is not logged in.");
    }
  };

  return (
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
  );
}

export default TaskForm;
