import React, { useState } from "react";
import { collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/TaskForm.css";

export function ShareButton() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    if (!email) {
      setError("Por favor, escribe una dirección de e-mail.");
      return;
    }

    try {
      const tasksRef = collection(db, "notes");
      const q = query(tasksRef, where("userId", "==", user.uid));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (taskDoc) => {
        await updateDoc(taskDoc.ref, {
          sharedWith: arrayUnion(email),
        });
      });

      const shareableLink = `${window.location.origin}/shared/${user.uid}`;
      setSuccess(`Lista de notas compartida con ${email}. Comparte este enlace: ${shareableLink}`);
      setEmail("");
      setIsShared(true);
    } catch (error) {
      setError("Error al compartir la lista. Intenta otra vez.");
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsShared(false);
    setSuccess("");
  }

  const copyToClipboard = () => {
    const shareableLink = `${window.location.origin}/shared/${user.uid}`;
    navigator.clipboard.writeText(shareableLink);
    alert("Enlace copiado al portapapeles.");
  }

  return (
    <>
      <button className="task-btn" onClick={() => setIsModalOpen(true)}>Compartir</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Comparte tu lista de notas</h2>
            {!isShared ? (
              <>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleShare}>Compartir</button>
                <button onClick={closeModal}>Cancelar</button>
                {error && <p className="error">{error}</p>}
              </>
            ) : (
              <>
                <p className="success">{success}</p>
                <button onClick={copyToClipboard}>Copiar enlace</button>
                <button onClick={closeModal}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}