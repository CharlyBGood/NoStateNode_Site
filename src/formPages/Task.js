import React, { useState } from "react";
import "../stylesheets/Task.css";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

function Task({ id, text, complete, completeTask, deleteTask, isReadOnly, createdAt, shareWith, ownerId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const taskDoc = doc(db, "notes", id);
      await updateDoc(taskDoc, { text: editText, updatedAt: new Date() });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="todo-edit-input task-input"
        />
      );
    }
    if (isValidUrl(text)) {
      return (
        <a href={text} target="_blank" rel="noopener noreferrer" className="todo-link">
          {text}
        </a>
      );
    }
    return <p>{text}</p>;
  };

  // Format date if present
  let createdDateStr = "";
  if (createdAt) {
    let dateObj;
    if (createdAt.seconds) {
      dateObj = new Date(createdAt.seconds * 1000);
    } else {
      dateObj = new Date(createdAt);
    }
    if (!isNaN(dateObj)) {
      createdDateStr = dateObj.toLocaleString();
    }
  }
  return (
    <div className="flex flex-col bg-black p-2 rounded">
      <div className={complete ? "todo-container complete rounded" : "todo-container rounded"}>
        <div className="todo-txt" onClick={() => !isReadOnly && !isEditing && completeTask(id)}>
          {renderContent()}
        </div>
        <div className="todo-container-icons">
          {!isReadOnly && (
            <>
              {isEditing ? (
                <FaSave className="todo-icon" onClick={handleSave} />
              ) : (
                <FaEdit className="todo-icon" onClick={handleEdit} />
              )}
              <FaTrash className="todo-icon" onClick={() => deleteTask(id)} />
            </>
          )}
        </div>
      </div>
      {createdDateStr && (
        <span className="task-date">Agregado: {createdDateStr}</span>
      )}
    </div>
  );
}

export default Task;