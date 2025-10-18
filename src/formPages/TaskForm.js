import { useEffect, useMemo, useState, useRef } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ConfirmationModal } from "../formPages/ConfirmationModal";
import "../stylesheets/TaskForm.css";

function TaskForm({ selectedUsers = [], onClearSelectedUsers, hideRecipientSelector = false }) {
  const [input, setInput] = useState("");
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);


  // Recipients logic: if hideRecipientSelector, always use selectedUsers as shareWith
  const initialMode = useMemo(() => {
    if (hideRecipientSelector) {
      if (Array.isArray(selectedUsers)) {
        if (selectedUsers.length === 0) return "private";
        if (selectedUsers.length === 1) return "single";
        return "multi";
      }
      return "private";
    } else {
      if (Array.isArray(selectedUsers)) {
        if (selectedUsers.length === 0) return "private";
        if (selectedUsers.length === 1) return "single";
        return "multi";
      }
      return "private";
    }
  }, [selectedUsers, hideRecipientSelector]);

  const [recipientsMode, setRecipientsMode] = useState(initialMode);
  const [selectedSingle, setSelectedSingle] = useState(
    Array.isArray(selectedUsers) && selectedUsers.length === 1 ? selectedUsers[0] : ""
  );
  const [selectedMulti, setSelectedMulti] = useState(
    Array.isArray(selectedUsers) && selectedUsers.length > 1 ? selectedUsers : []
  );

  // Mantener el estado interno en sync SOLO si selectedUsers cambia realmente desde el padre
  const prevSelectedUsersRef = useRef(selectedUsers);
  useEffect(() => {
    if (!Array.isArray(selectedUsers)) return;
    // Compara referencias y contenido para evitar loops
    const prev = prevSelectedUsersRef.current;
    const changed =
      prev !== selectedUsers &&
      (prev?.length !== selectedUsers.length ||
        prev.some((v, i) => v !== selectedUsers[i]));
    if (!changed) return;
    prevSelectedUsersRef.current = selectedUsers;
    if (hideRecipientSelector) {
      if (selectedUsers.length === 0) {
        setRecipientsMode("private");
        setSelectedSingle("");
        setSelectedMulti([]);
      } else if (selectedUsers.length === 1) {
        setRecipientsMode("single");
        setSelectedSingle(selectedUsers[0]);
        setSelectedMulti([]);
      } else if (selectedUsers.length > 1) {
        setRecipientsMode("multi");
        setSelectedSingle("");
        setSelectedMulti(selectedUsers);
      }
    } else {
      if (selectedUsers.length === 0) {
        setRecipientsMode("private");
        setSelectedSingle("");
        setSelectedMulti([]);
      } else if (selectedUsers.length === 1) {
        setRecipientsMode("single");
        setSelectedSingle(selectedUsers[0]);
        setSelectedMulti([]);
      } else if (selectedUsers.length > 1) {
        setRecipientsMode("multi");
        setSelectedSingle("");
        setSelectedMulti(selectedUsers);
      }
    }
  }, [selectedUsers, hideRecipientSelector]);

  // Load contacts for current owner
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const usersRef = collection(db, "usersToShare");
    const q = query(usersRef, where("ownerId", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setContacts(list);
        setIsLoadingContacts(false);
      },
      () => setIsLoadingContacts(false)
    );
    return () => unsub();
  }, []);

  const hasContacts = contacts.length > 0;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input) return;

    const user = auth.currentUser;
    if (user) {
      setIsLoading(true);
      try {
        // Determine recipients according to mode
        let shareWith = [];
        if (hideRecipientSelector) {
          // Always use selectedUsers as shareWith
          shareWith = Array.isArray(selectedUsers) ? selectedUsers : [];
        } else {
          if (recipientsMode === "private") {
            shareWith = [];
          } else if (recipientsMode === "single") {
            if (!selectedSingle) {
              setModalMessage("Selecciona un contacto");
              setIsModalHidden(false);
              setIsLoading(false);
              return;
            }
            shareWith = [selectedSingle];
          } else if (recipientsMode === "multi") {
            if (!selectedMulti || selectedMulti.length === 0) {
              setModalMessage("Selecciona al menos un contacto");
              setIsModalHidden(false);
              setIsLoading(false);
              return;
            }
            shareWith = selectedMulti;
          }
        }

        const newTask = {
          text: input,
          complete: false,
          userId: user.uid,
          shareWith,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await addDoc(collection(db, "notes"), newTask);
        setInput("");
        // Reset selections after create
        setRecipientsMode("private");
        setSelectedSingle("");
        setSelectedMulti([]);
        onClearSelectedUsers && onClearSelectedUsers();
        setModalMessage("Nota añadida con éxito.");
      } catch (error) {
        console.error("Error adding task: ", error);
        setModalMessage("Error al añadir la nota.");
      } finally {
        setIsLoading(false);
        setIsModalHidden(false);
      }
    } else {
      console.error("User is not logged in.");
      setModalMessage("El usuario no ha iniciado sesión.");
      setIsModalHidden(false);
    }
  };

  return (
    <>
      <form id="form" className="task-form" onSubmit={handleSend}>
        <input
          className="task-input"
          type="text"
          id="task-input"
          placeholder="Añade una nota o enlace"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />

        {/* Guardar en: destino de la nota */}
        {!hideRecipientSelector && (
          <fieldset className="w-full" style={{ border: "none", padding: 0, margin: 0 }}>
            <legend className="sr-only">Guardar en</legend>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipientsMode"
                  value="private"
                  checked={recipientsMode === "private"}
                  onChange={() => setRecipientsMode("private")}
                />
                <span>Solo tú</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipientsMode"
                  value="single"
                  checked={recipientsMode === "single"}
                  onChange={() => {
                    setRecipientsMode("single");
                    // Always set to first contact if available
                    setSelectedSingle(contacts[0]?.email || "");
                  }}
                  disabled={!hasContacts}
                />
                <span>Un contacto</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipientsMode"
                  value="multi"
                  checked={recipientsMode === "multi"}
                  onChange={() => {
                    setRecipientsMode("multi");
                    // Always set to all contacts if available, else empty
                    setSelectedMulti(contacts.length > 0 ? contacts.map((c) => c.email) : []);
                  }}
                  disabled={!hasContacts}
                />
                <span>Varios</span>
              </label>
            </div>
          </fieldset>
        )}

        {!hideRecipientSelector && recipientsMode === "single" && (
          <select
            className="user-select task-input w-full mb-2 rounded-lg block p-2.5"
            value={contacts.find(c => c.email === selectedSingle) ? selectedSingle : (contacts[0]?.email || "")}
            onChange={(e) => setSelectedSingle(e.target.value)}
            disabled={isLoadingContacts || !hasContacts}
          >
            <option value="" disabled>
              {isLoadingContacts ? "Cargando contactos..." : "Elige un contacto"}
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.email}>
                {c.email}
              </option>
            ))}
          </select>
        )}

        {!hideRecipientSelector && recipientsMode === "multi" && (
          <select
            multiple
            className="user-select task-input w-full mb-2 rounded-lg block p-2.5"
            value={selectedMulti.filter(email => contacts.some(c => c.email === email))}
            onChange={(e) =>
              setSelectedMulti(Array.from(e.target.selectedOptions).map((o) => o.value))
            }
            disabled={isLoadingContacts || !hasContacts}
            size={Math.min(4, Math.max(2, contacts.length))}
          >
            {contacts.map((c) => (
              <option key={c.id} value={c.email}>
                {c.email}
              </option>
            ))}
          </select>
        )}
        <button type="submit" className="log-btn border-none border rounded py-1 px-3" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir"}
        </button>
      </form>
      <ConfirmationModal
        isHidden={isModalHidden}
        onDeleteCancel={() => setIsModalHidden(true)}
        onDeleteConfirm={() => setIsModalHidden(true)}
        modalTitle={modalMessage}
        buttonOneText="Cerrar"
        buttonTwoText=""
      />
    </>
  );
}

export default TaskForm;