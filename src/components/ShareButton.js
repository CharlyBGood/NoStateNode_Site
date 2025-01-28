import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ConfirmationModal } from "../formPages/ConfirmationModal";

export const ShareButton = () => {
  const { user } = useAuth();
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalMessage, setModalMessage] = useState("");

  const copyToClipboard = async () => {
    if (!user) {
      setModalMessage("Debes iniciar sesión para compartir la lista.");
      setIsModalHidden(false);
      return;
    }

    const shareableLink = `${window.location.origin}/shared/${user.uid}`;
    try {
      await navigator.clipboard.writeText(shareableLink);
      setModalMessage("Enlace copiado al portapapeles.");
    } catch (err) {
      setModalMessage("Error al copiar enlace.");
    }
    setIsModalHidden(false);
  };

  return (
    <div className="share-btn-container">
      <button
        type="button"
        className="share-btn task-btn"
        onClick={copyToClipboard}
      >
        Compartir lista
      </button>
      <ConfirmationModal
        isHidden={isModalHidden}
        onDeleteCancel={() => setIsModalHidden(true)}
        onDeleteConfirm={() => setIsModalHidden(true)}
        modalTitle={modalMessage}
        buttonOneText="Cerrar"
        buttonTwoText=""
      />
    </div>
  );
};

export default ShareButton;