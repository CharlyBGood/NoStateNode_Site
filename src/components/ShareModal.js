import React from 'react';

const ShareModal = ({ isHidden, onClose, modalTitle, copyToClipboard, yourLink }) => {
  if (isHidden) return null;

  return (
    <div className={isHidden ? "hide-modal" : "show-modal"}>
      <div className="modal-content">
        <p>{modalTitle}</p>
        {/* <button
          className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
          onClick={() => window.open(`https://telegram.me/share/url?url=${yourLink}&text=Mira+mi+lista+de+recursos+en+NoStateNode`, '_blank')}>Telegram</button> */}
        {/* <button
          className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
          onClick={() => window.open(`https://web.whatsapp.com/send?text=Mira+mi+lista+de+recursos+en+NoStateNode&url=${yourLink}`, '_blank')}>WhatsApp</button> */}
        <button
          className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
          onClick={() => navigator.share({
            title: "NoStateNode",
            text: "Mira mi lista de recursos en NoStateNode",
            url: {yourLink},
          })}>Compartir por:</button>

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