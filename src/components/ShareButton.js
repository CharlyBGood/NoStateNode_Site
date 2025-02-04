import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ShareModal from "./ShareModal";

export const ShareButton = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalMessage, setModalMessage] = useState("");

  const copyToClipboard = async () => {
    if (!user) {
      setModalMessage("Debes iniciar sesión para compartir la lista.");
      setIsModalHidden(false);
      return;
    }

    setIsLoading(true);
    const shareableLink = `${window.location.origin}/shared/${user.uid}`;
    try {
      await navigator.clipboard.writeText(shareableLink);
      setModalMessage("Enlace copiado al portapapeles.");
    } catch (err) {
      setModalMessage("Error al copiar enlace.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (!user) {
      setModalMessage("Debes iniciar sesión para compartir la lista.");
      setIsModalHidden(false);
      return;
    }

    const shareableLink = `${window.location.origin}/shared/${user.uid}`;
    if (navigator.share) {
      navigator.share({
        title: "NoStateNode",
        text: "Mira mi lista de recursos en NoStateNode",
        url: shareableLink,
      })
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.log("Error sharing", error);
          setIsLoading(false);
        });
    } else {
      setModalMessage("Web Share API no soportada. Usa las opciones de abajo.");
      setIsModalHidden(false);
    }
  };

  return (
    <div className="share-btn-container">
      <button
        type="button"
        className="share-btn task-btn"
        onClick={handleShare}
        disabled={isLoading}
      >
        {isLoading ? "Compartiendo..." : "Compartir lista"}
      </button>
      <ShareModal
        isHidden={isModalHidden}
        onClose={() => setIsModalHidden(true)}
        modalTitle={modalMessage}
        copyToClipboard={copyToClipboard}
        yourLink={`${window.location.origin}/shared/${user ? user.uid : ''}`}
      />
    </div>
  );
};

export default ShareButton;