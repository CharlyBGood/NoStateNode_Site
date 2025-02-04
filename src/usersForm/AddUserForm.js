import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ConfirmationModal } from "../formPages/ConfirmationModal";

const AddUserForm = ({ onContactAdded }) => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          setIsModalOpen(false);
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

  return (
    <>
      {/* <div className="share-btn-container"> */}
        <button className="share-btn task-btn" onClick={() => setIsModalOpen(true)}>
          Añadir contacto
        </button>
      {/* </div> */}

      {isModalOpen &&
        <form id="users-form" onSubmit={handleAddUser} className="task-form">
          <input
            id="contact-email"
            className="task-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <div className="share-btn-container">
            <button className="log-btn border-none font-bold block border rounded mb-2 py-2 px-4 w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Añadiendo..." : "Añadir contacto"}
            </button>
            <button type="button" className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      }

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