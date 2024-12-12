export function ConfirmationModal({
  isHidden,
  onDeleteCancel,
  onDeleteConfirm,
}) {
  return (
    <div className={isHidden ? "hide-modal" : "show-modal"}>
      <div className="modal-content">
        <p>¿Eliminar de la lista?</p>
        <div className="btn-container">
          <button
            title="Delete"
            className="btn-delete"
            onClick={onDeleteConfirm}
          >
            Eliminar
          </button>
          <button
            title="Cancel"
            className="btn-cancel"
            onClick={onDeleteCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}