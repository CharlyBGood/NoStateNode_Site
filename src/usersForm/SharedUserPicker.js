import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FaTrash } from "react-icons/fa";

const SharedUserPicker = ({ onUserSelected }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, "usersToShare");
    const q = query(usersRef, where("ownerId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    }, (err) => {
      console.error(err);
      setError("Error al intentar obtener los usuarios");
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    onUserSelected(selectedOptions);
    const selectedUser = users.find(user => user.email === selectedOptions[0]);
    setSelectedUser(selectedUser);
  };

  const handleRemoveUser = async () => {
    if (selectedUser) {
      try {
        await deleteDoc(doc(db, "usersToShare", selectedUser.id));
        setSelectedUser(null);
      } catch (err) {
        console.error("Error removing user: ", err);
        setError("Error al intentar eliminar el usuario");
      }
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div className="user-picker-container">
        <select
          id="select-email"
          onChange={handleUserSelect}
          className="user-select task-input w-full mb-2 rounded-lg block p-2.5"
          defaultValue=""
        >
          <option value="" disabled className="placeholder-option">Comparte con un contacto de tu lista</option>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
        {selectedUser && (
          <button onClick={handleRemoveUser} className="remove-button ml-2">
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default SharedUserPicker;