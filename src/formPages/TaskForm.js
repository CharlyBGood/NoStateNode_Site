import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import "../stylesheets/TaskForm.css";

function TaskForm({ createInput }) {
  const [input, setInput] = useState("");

  const handleSend = (e) => {
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
    <form id="form" className="bg-neutral shadow-md rounded px-8 pt-6 pb-2" onSubmit={handleSend}>
      <div className="mb-4">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Añade una nota"
        value={input}
        name="text"
        onChange={(e) => setInput(e.target.value)}
      />      
      </div>
      <button className="bg-orange-600 hover:bg-orange-400 w-100 border-none text-black font-bold block border rounded mb-2 py-2 px-4 w-full">Agregar</button>
    </form>
  );
}

export default TaskForm;
