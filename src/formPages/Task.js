import "../stylesheets/Task.css";
import { FaTrash } from "react-icons/fa";

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

function Task({ id, text, complete, completeTask, deleteTask, isReadOnly }) {
  const renderContent = () => {
    if (isValidUrl(text)) {
      return (
        <a href={text} target="_blank" rel="noopener noreferrer" className="todo-link">
          {text}
        </a>
      );
    }
    return <span>{text}</span>
  }

  return (
    <div className={complete ? "todo-container complete" : "todo-container"}>
      <div className="todo-txt" onClick={() => !isReadOnly && completeTask(id)}>
        {renderContent()}
      </div>
      <div className="todo-container-icons" onClick={() => deleteTask(id)}>
        {(isReadOnly ? "" : <FaTrash className="todo-icon" />)}
      </div>
    </div>
  );
}

export default Task;