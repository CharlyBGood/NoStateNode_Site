import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ConfirmationModal } from "../formPages/ConfirmationModal";

const AddUserForm = ({ onContactAdded }) => {
  const [email, setEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleAddUser = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (!email.trim()) {
      setModalMessage("El campo de email no puede estar vacío.");
      setIsConfirmationModalOpen(true);
      return;
    }

    if (!validateEmail(email.trim())) {
      setModalMessage("Por favor, introduce un email válido.");
      setIsConfirmationModalOpen(true);
      return;
    }

    if (currentUser) {
      setIsLoading(true);
      try {
        const usersRef = collection(db, "usersToShare");
        const q = query(
          usersRef,
          where("ownerId", "==", currentUser.uid),
          where("email", "==", email.trim())
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          const newContact = {
            email: email.trim(),
            ownerId: currentUser.uid,
            createdAt: new Date(),
          };
          await addDoc(usersRef, newContact);
          setEmail("");
          setIsDropdownOpen(false);
          setModalMessage("Usuario añadido con éxito.");
          onContactAdded();
        } else {
          setModalMessage("El contacto ya existe.");
        }
        setIsConfirmationModalOpen(true);
      } catch (err) {
        console.error(err);
        setModalMessage("Error al añadir el contacto.");
        setIsConfirmationModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape') setIsDropdownOpen(false);
    };
    if (isDropdownOpen) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [isDropdownOpen]);

  return (
    <>
      <button className="share-btn task-btn" onClick={() => setIsDropdownOpen((o) => !o)}>
        Añadir contacto
      </button>

      {isDropdownOpen && (
        <>
          {/* backdrop para cerrar al hacer click fuera */}
          <div className="dropdown-backdrop" onClick={() => setIsDropdownOpen(false)} />
          <div className="dropdown-panel" role="dialog" aria-modal="true">
            <form id="users-form" onSubmit={handleAddUser} className="task-form m-0">
              <input
                id="contact-email"
                className="task-input"
                type="email"
                placeholder="Email del contacto"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <div className="share-btn-container">
                <button
                  className="log-btn border-none font-bold block border rounded-sm mb-2 py-2 px-4 w-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Añadiendo..." : "Añadir contacto"}
                </button>
                <button
                  type="button"
                  className="btn-cancel font-bold block rounded-sm mb-2 py-2 px-4 w-full"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <ConfirmationModal
        isHidden={!isConfirmationModalOpen}
        onDeleteCancel={() => setIsConfirmationModalOpen(false)}
        onDeleteConfirm={() => setIsConfirmationModalOpen(false)}
        modalTitle={modalMessage}
        buttonOneText="Cerrar"
        buttonTwoText=""
      />
    </>
  );
};

export default AddUserForm;