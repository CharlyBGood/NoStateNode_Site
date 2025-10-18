import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SharedRecipientCard from "./SharedRecipientCard";

export default function SharedRecipientsGrid({ notes }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ownerId = user?.uid;

  // Agrupa por email en shareWith y cuenta
  // Agrupa por email y junta ids y alias
  const { groups, privateCount } = useMemo(() => {
    const map = new Map();
    let priv = 0;
    for (const n of notes) {
      const list = Array.isArray(n.shareWith) ? n.shareWith : [];
      if (list.length === 0) {
        priv += 1;
      }
      for (const email of list) {
        // Si ya existe, agrega el id a la lista
        if (!map.has(email)) {
          map.set(email, { count: 1, ids: [n.id], alias: n.alias });
        } else {
          const entry = map.get(email);
          entry.count += 1;
          entry.ids.push(n.id);
        }
      }
    }
    return {
      groups: Array.from(map.entries()).map(([email, { count, ids, alias }]) => ({ email, count, id: ids[0], alias })),
      privateCount: priv,
    };
  }, [notes]);

  if (groups.length === 0 && privateCount === 0) {
    return <p>No hay notas aún. ¡Crea una y compártela con tus contactos!</p>;
  }

  return (
    <div className="task-list-container">
      {privateCount > 0 && ownerId && (
        <SharedRecipientCard
          key="__private__"
          email="Solo tú"
          count={privateCount}
          onClick={() => navigate(`/shared/${ownerId}?recipient=${encodeURIComponent("__private")}`)}
        />
      )}
      {groups.map(({ email, count, id, alias }) => (
        <SharedRecipientCard
          key={email}
          id={id}
          email={email}
          count={count}
          alias={alias}
          onClick={e => {
            // Si está editando, no navegar
            if (e.target.tagName === 'INPUT') return;
            ownerId && navigate(`/shared/${ownerId}?recipient=${encodeURIComponent(email)}`);
          }}
        />)
      )}
    </div>
  );
}
