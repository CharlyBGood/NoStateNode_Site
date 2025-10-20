
const ShareModal = ({ isHidden, onClose, modalTitle, copyToClipboard, yourLink }) => {
  if (isHidden) return null;

  return (
    <div className={isHidden ? "hide-modal" : "show-modal"}>
      <div className="modal-content">
        <p>{modalTitle}</p>
        <button
          className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "NoStateNode",
                text: "Mira mi lista de recursos en NoStateNode",
                url: yourLink,
              }).catch(() => {/* user canceled or share failed */ });
            } else {
              alert("Tu navegador no soporta compartir nativo. Copia el enlace con el botón de abajo.");
            }
          }}
        >
          Compartir por:
        </button>
        <button
          title="Copiar enlace"
          className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
          onClick={copyToClipboard}
        >
          Copiar enlace
        </button>
        <button className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ShareModal;