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
            className="btn-delete"
            onClick={onDeleteConfirm}
          >
            {buttonOneText}
          </button>
          <button
            title="Cancel"
            className="btn-cancel"
            onClick={onDeleteCancel}
          >
            {buttonTwoText}
          </button>
        </div>
      </div>
    </div>
  );
}