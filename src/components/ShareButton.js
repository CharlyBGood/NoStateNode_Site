import React from "react";
import { useAuth } from "../context/AuthContext";

export function ShareButton() {
  const { user } = useAuth();

  const copyToClipboard = async () => {
    const shareableLink = `${window.location.origin}/shared/${user.uid}`;
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert("Enlace copiado al portapapeles.");
    } catch (err) {
      alert("Error al copiar enlace.");
    }
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
    </div>
  );
}