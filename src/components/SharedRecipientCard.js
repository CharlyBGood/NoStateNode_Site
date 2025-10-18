import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SharedRecipientCard({ id, email, count, onClick, alias }) {
  const [cardAlias, setCardAlias] = useState(alias || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCardAlias(alias || "");
  }, [alias]);

  // Guarda el alias en Firestore solo al click en la tilde
  const handleAliasSave = async (e) => {
    e.stopPropagation();
    setIsEditing(false);
    if (!id) return;
    try {
      await updateDoc(doc(db, "usersToShare", id), { alias: cardAlias });
    } catch (e) {
      console.error("Error al guardar alias:", e);
    }
  };

  return (
    <div
      className="task-btn w-full text-left mb-3 p-4 rounded shadow hover:opacity-90"
      onClick={isEditing ? undefined : onClick}
      style={{ cursor: isEditing ? "default" : "pointer" }}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <div className="font-bold recipient-email break-words flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={cardAlias}
                  onChange={e => setCardAlias(e.target.value)}
                  autoFocus
                  className="border rounded px-2 py-1 bg-slate-800 text-white"
                  placeholder="Alias"
                  onClick={e => e.stopPropagation()}
                />
                <button
                  type="button"
                  className="ml-2 text-green-500 hover:text-green-700"
                  onClick={handleAliasSave}
                  tabIndex={0}
                  aria-label="Guardar alias"
                >
                  ✔️
                </button>
              </>
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
          onClick={e => {
            if (!isEditing) onClick(e);
          }}
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
