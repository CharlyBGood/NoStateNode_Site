import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ShareModal from "./ShareModal";

export const ShareButton = ({ mode = "perfil", userId, noteId, listId }) => {
  // mode: "perfil" (dashboard), "lista" (lista compartida), o "card" (nota individual)
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
    const shareableLink = getShareableLink();
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

    setIsLoading(true);
    const shareableLink = getShareableLink();

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
      setIsLoading(false);
    }
  };

  const getShareableLink = () => {
    const ownerId = userId || user?.uid || '';
    if (mode === "lista" && listId) {
      // Compartir una lista filtrada (por contacto)
      return `${window.location.origin}/shared/${ownerId}/list/${encodeURIComponent(listId)}`;
    }
    if (mode === "card" && noteId) {
      // Compartir una nota individual
      return `${window.location.origin}/shared/${ownerId}/note/${noteId}`;
    }
    // Default: perfil/dashboard
    return `${window.location.origin}/shared/${ownerId}`;
  }

  return (
    <>
      <button
        type="button"
        className="share-btn task-btn"
        onClick={handleShare}
        disabled={isLoading}
      >
        {isLoading
          ? "Compartiendo..."
          : mode === "perfil"
            ? "Compartir perfil"
            : "Compartir lista"}
      </button>
      <ShareModal
        isHidden={isModalHidden}
        onClose={() => setIsModalHidden(true)}
        modalTitle={modalMessage}
        copyToClipboard={copyToClipboard}
        yourLink={getShareableLink()}
      />
    </>
  );
};

export default ShareButton;