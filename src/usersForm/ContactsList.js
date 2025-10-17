import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ConfirmationModal } from "../formPages/ConfirmationModal";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, contactId: null, email: "" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const usersRef = collection(db, "usersToShare");
    const q = query(usersRef, where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async () => {
    if (!modal.contactId) return;
    try {
      await deleteDoc(doc(db, "usersToShare", modal.contactId));
      setFeedback("Contacto eliminado");
    } catch (e) {
      setFeedback("Error al eliminar contacto");
    } finally {
      setModal({ open: false, contactId: null, email: "" });
    }
  };

  if (isLoading) return <p>Cargando contactos...</p>;
  if (contacts.length === 0) return <p>No tienes contactos agregados aún.</p>;

  return (
    <div className="contacts-list w-full flex flex-col gap-2 mt-2">
      {contacts.map((c) => (
        <div key={c.id} className="flex items-center justify-between bg-transparent border-b border-gray-700 py-1 px-2">
          <span className="truncate" title={c.email}>{c.email}</span>
          <button
            className="remove-button ml-2"
            onClick={() => setModal({ open: true, contactId: c.id, email: c.email })}
            aria-label={`Eliminar contacto ${c.email}`}
          >
            Eliminar
          </button>
        </div>
      ))}
      <ConfirmationModal
        isHidden={!modal.open}
        onDeleteCancel={() => setModal({ open: false, contactId: null, email: "" })}
        onDeleteConfirm={handleDelete}
        modalTitle={`¿Eliminar contacto ${modal.email}?`}
        buttonOneText="Cancelar"
        buttonTwoText="Eliminar"
      />
      {feedback && <p className="text-sm text-center mt-2">{feedback}</p>}
    </div>
  );
}
