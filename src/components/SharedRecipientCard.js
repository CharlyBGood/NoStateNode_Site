import React from "react";

export default function SharedRecipientCard({ email, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="task-btn w-full text-left mb-3 p-4 rounded-sm shadow-sm hover:opacity-90"
      title={`Ver ${count} notas compartidas con ${email}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold">{email}</div>
          <div className="text-sm opacity-80">{count} recursos compartidos</div>
        </div>
        <span aria-hidden>→</span>
      </div>
    </button>
  );
}
