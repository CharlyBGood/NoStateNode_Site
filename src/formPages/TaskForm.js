import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

import "../stylesheets/TaskForm.css";

function TaskForm({ createInput }) {
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    const newTask = {
      id: uuidv4(),
      text: input,
      complete: false,
    };

    createInput(newTask);
    setInput("");
  };

  return (
    <form id="form" className="task-form" onSubmit={handleSend}>
      <input
        className="task-input"
        type="text"
        placeholder="Añade una nota"
        value={input}
        name="text"
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="task-btn">Agregar</button>
    </form>
  );
}

export default TaskForm;
