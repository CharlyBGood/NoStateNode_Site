export function ConfirmationModal({
  isHidden,
  onDeleteCancel,
  onDeleteConfirm,
  modalTitle,
  buttonOneText,
  buttonTwoText
}) {
  return (
    <div className={isHidden ? "hide-modal" : "show-modal"}>
      <div className="modal-content">
        <p>{modalTitle}</p>
        <div className="btn-container">
          <button
            title="Delete"
            className="btn-delete font-bold block rounded mb-2 py-2 px-4 w-full"
            onClick={onDeleteConfirm}
          >
            {buttonOneText}
          </button>
          <button
            title="Cancel"
            className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full"
            onClick={onDeleteCancel}
          >
            {buttonTwoText}
          </button>
        </div>
      </div>
    </div>
  );
}