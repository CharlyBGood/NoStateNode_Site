import React from 'react';

const ShareModal = ({ isHidden, onClose, modalTitle, copyToClipboard, yourLink }) => {
  if (isHidden) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{modalTitle}</p>
        <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${yourLink}`, '_blank')}>Facebook</button>
        
        <button
          title="Copiar enlace"
          className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
          onClick={copyToClipboard}
        >
          Copiar enlace
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ShareModal;