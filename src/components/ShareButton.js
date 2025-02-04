import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ShareModal from "./ShareModal";

export const ShareButton = () => {
  const { user } = useAuth();
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shareableLink = `${window.location.origin}/shared/${user.uid}`;

  const copyToClipboard = async () => {
    if (!user) {
      setModalMessage("Debes iniciar sesión para compartir la lista.");
      setIsModalHidden(false);
      return;
    }

    setIsLoading(true);
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setModalMessage("Enlace copiado al portapapeles.");
    } catch (err) {
      setModalMessage("Error al copiar enlace.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="share-btn-container">
      <button
        type="button"
        className="share-btn task-btn"
        onClick={() => setIsModalHidden(false)}
        disabled={isLoading}
      >
        {isLoading ? "Copiando..." : "Compartir lista"}
      </button>
      <ShareModal
        isHidden={isModalHidden}
        onClose={() => setIsModalHidden(true)}
        modalTitle={modalMessage}
        copyToClipboard={copyToClipboard}
        yourLink={shareableLink}
      />
    </div>
  );
};

export default ShareButton;