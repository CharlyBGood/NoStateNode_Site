import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FaTrash, FaChevronDown } from "react-icons/fa";
import { ConfirmationModal } from "../formPages/ConfirmationModal";

const SharedUserPicker = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modal, setModal] = useState({ open: false, contactId: null, email: "" });
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
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
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setError("Error al intentar obtener los usuarios");
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);


  const handleRemoveUser = (id, email) => {
    setModal({ open: true, contactId: id, email });
  };

  const confirmRemoveUser = async () => {
    const id = modal.contactId;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "usersToShare", id));
    } catch (err) {
      console.error("Error removing user: ", err);
      setError("Error al intentar eliminar el usuario");
    } finally {
      setDeletingId(null);
      setModal({ open: false, contactId: null, email: "" });
    }
  };

  return (
    <div className="relative w-full mt-2" ref={dropdownRef}>
      {error && <p>{error}</p>}
      <button
        type="button"
        className="user-select task-input w-full flex items-center justify-between mb-2 rounded-lg p-2.5"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isLoading || users.length === 0}
      >
        <span className="truncate">
          {isLoading ? "Cargando contactos..." : users.length === 0 ? "No tienes contactos agregados aún." : "Ver contactos agregados"}
        </span>
        <FaChevronDown className="ml-2" />
      </button>
      {open && users.length > 0 && (
        <ul className="absolute z-10 w-full bg-[var(--soft-black)] border border-[var(--dark-black)] rounded shadow-lg max-h-48 overflow-auto mt-1">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between px-3 py-2 border-b border-gray-700 last:border-b-0">
              <span className="truncate" title={user.email}>{user.email}</span>
              <button
                className="remove-button ml-2"
                onClick={() => handleRemoveUser(user.id, user.email)}
                disabled={deletingId === user.id}
                aria-label={`Eliminar contacto ${user.email}`}
                type="button"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationModal
        isHidden={!modal.open}
        onDeleteCancel={() => setModal({ open: false, contactId: null, email: "" })}
        onDeleteConfirm={confirmRemoveUser}
        modalTitle={`¿Eliminar contacto ${modal.email}?`}
        buttonOneText="Cancelar"
        buttonTwoText="Eliminar"
      />
    </div>
  );
};

export default SharedUserPicker;