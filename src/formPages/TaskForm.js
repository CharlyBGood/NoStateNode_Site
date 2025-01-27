// import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import "../stylesheets/TaskForm.css";
import { ShareButton } from "../components/ShareButton";

function TaskForm() {
  const [input, setInput] = useState("");
  const [emails, setEmails] = useState("");
  const [error, setError] = useState("");


  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError(error, "Por favor, escribe una nota o enlace.");
      return;
    }

    const user = auth.currentUser;
    if (user) {      
      try {
        const emailList = emails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email);
          
        const newTask = {
          text: input,
          complete: false,
          userId: user.uid,
          shareWith: emailList,
          createdAt: new Date(),
          updatedAt: new Date(),
        };        
        const docRef = await addDoc(collection(db, "notes"), newTask);
        setInput("");
        setEmails("");
        setError(null);
        console.log("Task added with ID: ", docRef.id);
        console.log("Task added: ", docRef.shareWith);
      } catch (error) {
        console.error("Error adding task: ", error);
        setError("Error al agregar la tarea. Intenta otra vez.");
      }
    } else {
      setError("Inicia sesión para crear una nota.");
      console.error("User is not logged in.");
    }
  };

  return (
    <>
      <ShareButton />
      <form id="form" className="task-form" onSubmit={handleSend}>
        <input
          className="task-input"
          type="text"
          placeholder="Añade una nota o enlace"
          value={input}
          name="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          className="task-input"
          type="email"
          placeholder="Escribe un e-mail para compartir"
          value={emails}
          name="emails"
          onChange={(e) => setEmails(e.target.value)}
        />
        <button className="task-btn">Agregar</button>
      </form>
    </>
  );
}

export default TaskForm;
