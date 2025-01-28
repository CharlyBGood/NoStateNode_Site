import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

const SharedUserPicker = ({ onUserSelected }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;

      try {
        const usersRef = collection(db, "usersToShare");
        const q = query(usersRef, where("ownerId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (err) {
        console.error(err);
        setError("Error al intentar obtener los usuarios");
      }
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <>
      <select
        id="select-email"
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value)
          onUserSelected(selectedOptions);
        }}
        class="task-input w-full mb-2 rounded-lg block w-full p-2.5 dark:placeholder-gray-900 ">
        <option selected className="text-sm font-medium">Elige un contacto si quieres que puedan ver la nota</option>
        {users.map((user) => (
          <option key={user.id} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}
    </>
  );
}

export default SharedUserPicker;