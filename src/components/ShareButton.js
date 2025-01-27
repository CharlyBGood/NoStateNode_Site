import React, { useState } from "react";
// import { collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
// import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/TaskForm.css";



export function ShareButton() {
  const { user } = useAuth();
  // const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // const [isShared, setIsShared] = useState(false);

  // const handleShare = async () => {
  //   if (!email.trim()) {
  //     setError("Por favor, escribe una dirección de e-mail válida.");
  //     return;
  //   }

  //   try {
  //     const tasksRef = collection(db, "notes");
  //     const q = query(tasksRef, where("userId", "==", user.uid));

  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach(async (taskDoc) => {
  //       await updateDoc(taskDoc.ref, {
  //         sharedWith: arrayUnion(email),
  //       });
  //     });

  //     const shareableLink = `${window.location.origin}/shared/${user.uid}`;
  //     setSuccess(`Lista de notas compartida con ${email}. Envíale este enlace: ${shareableLink}`);
  //     setEmail("");
  //     setIsShared(true);
  //   } catch (error) {
  //     setError("Error al compartir la lista. Intenta otra vez.");
  //     console.error(error);
  //   }
  // };

  const closeModal = () => {
    setIsModalOpen(false);
    // setIsShared(false);
    setSuccess("");
  }

  const copyToClipboard = () => {
    const shareableLink = `${window.location.origin}/shared/${user.uid}`;
    navigator.clipboard.writeText(shareableLink);
    alert("Enlace copiado al portapapeles.");
  }

  return (
    <>
      <div className="share-button-container">
        <button onClick={() => setIsModalOpen(true)} className="share-btn task-btn">Compartir</button>
      </div>
      {isModalOpen && (
        <div className="sharing-modal">
          <div className="sharing-modal-content">
            <h2>Compartir lista de notas</h2>
            <p>Envía este enlace para compartir tu lista:</p>
            <p className="shareable-link">{`${window.location.origin}/shared/${user.uid}`}</p>
            <div className="share-btn-container">
              <button className="log-btn border-none font-bold block border rounded mb-2 py-2 px-4 w-full" onClick={copyToClipboard}>
                Copiar enlace
              </button>
              <button className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}