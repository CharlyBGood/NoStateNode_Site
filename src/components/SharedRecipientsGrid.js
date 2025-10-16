import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SharedRecipientCard from "./SharedRecipientCard";

export default function SharedRecipientsGrid({ notes }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ownerId = user?.uid;

  // Agrupa por email en shareWith y cuenta
  const { groups, privateCount } = useMemo(() => {
    const map = new Map();
    let priv = 0;
    for (const n of notes) {
      const list = Array.isArray(n.shareWith) ? n.shareWith : [];
      if (list.length === 0) {
        priv += 1;
      }
      for (const email of list) {
        map.set(email, (map.get(email) || 0) + 1);
      }
    }
    return {
      groups: Array.from(map.entries()).map(([email, count]) => ({ email, count })),
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
      {groups.map(({ email, count }) => (
        <SharedRecipientCard
          key={email}
          email={email}
          count={count}
          onClick={() => ownerId && navigate(`/shared/${ownerId}?recipient=${encodeURIComponent(email)}`)}
        />)
      )}
    </div>
  );
}
