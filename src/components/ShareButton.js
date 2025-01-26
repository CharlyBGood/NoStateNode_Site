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
    if (!email.trim()) {
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
      setSuccess(`Lista de notas compartida con ${email}. Envíale este enlace: ${shareableLink}`);
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
      {/* <div className="share-btn-container">
        
      </div> */}
      <button className="log-btn share-btn border-none font-bold block border rounded mb-2 py-2 px-4 w-full" onClick={() => setIsModalOpen(true)}>Compartir notas</button>

      {isModalOpen && (
        <div className="sharing-modal">
          <div className="sharing-modal-content">
            {!isShared ? (
              <>
                <input
                  className="bg-transparent shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  placeholder="Email del destinatario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="share-btn-container">
                  <button className="log-btn w-100 border-none font-bold block border rounded mb-2 py-2 px-4 w-full" onClick={handleShare}>Compartir</button>
                  <button className="w-100 border-gray-900 font-bold block border rounded mb-2 py-2 px-4 w-full" onClick={closeModal}>Cancelar</button>
                </div>
                {error && <p className="error">{error}</p>}
              </>
            ) : (
              <div>
                <p className="success">{success}</p>
                <button className="share-btn task-btn" onClick={copyToClipboard}>Copiar enlace</button>
                <button className="share-btn task-btn" onClick={closeModal}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}