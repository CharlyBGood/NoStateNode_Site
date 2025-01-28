import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const SharedUserPicker = ({ onUserSelected }) => {
  const [users, setUsers] = useState([]);
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

  return (
    <>
      {error && <p>{error}</p>}
      <select
        id="select-email"
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
          onUserSelected(selectedOptions);
        }}
        className="user-select task-input w-full mb-2 rounded-lg block w-full p-2.5 dark:placeholder-gray-900"
      >
        <option selected className="text-sm font-medium">Elige un contacto si quieres que puedan ver la nota</option>
        {users.map((user) => (
          <option key={user.id} value={user.email}>
            {user.email}            
          </option>
        ))}
      </select>
    </>
  );
};

export default SharedUserPicker;