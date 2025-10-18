import { useEffect, useState } from "react";

export default function SharedRecipientCard({ email, count, onClick, alias }) {
  const [cardAlias, setCardAlias] = useState(alias || "");
    const [isEditing, setIsEditing] = useState(false); // Added state for editing

  useEffect(() => {
    setCardAlias(alias || "");
  }, [alias]);

  return (
    <div className="task-btn w-full text-left mb-3 p-4 rounded shadow hover:opacity-90">
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <div className="font-bold recipient-email break-words flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={cardAlias}
                onChange={e => setCardAlias(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="border rounded px-2 py-1 bg-slate-800 text-white"
                placeholder="Alias"
              />
            ) : (
              <>
                <span>{cardAlias || email}</span>
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-800"
                  onClick={e => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  tabIndex={0}
                  aria-label="Editar nombre"
                >
                  🖉
                </button>
              </>
            )}
          </div>
          <div className="text-sm opacity-80">{count} recursos compartidos</div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="bg-transparent border-none"
          tabIndex={0}
          aria-label="Ver notas"
        >
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
