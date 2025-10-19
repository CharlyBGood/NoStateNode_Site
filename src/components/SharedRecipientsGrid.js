import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SharedRecipientCard from "./SharedRecipientCard";

export default function SharedRecipientsGrid({ notes, contacts }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ownerId = user?.uid;

  // Agrupamiento: una card "Varios" para notas con múltiples usuarios, y cards individuales para las demás
  const { multiShared, individualGroups, privateCount } = useMemo(() => {
    let priv = 0;
    const multiSharedNotes = [];
    const individualMap = new Map();
    for (const n of notes) {
      const list = Array.isArray(n.shareWith) ? n.shareWith : [];
      if (list.length === 0) {
        priv += 1;
      } else if (list.length > 1) {
        multiSharedNotes.push(n);
      } else if (list.length === 1) {
        const email = list[0];
        const contact = (contacts || []).find(c => c.email === email);
        const contactId = contact?.id || null;
        const contactAlias = contact?.alias || "";
        if (!individualMap.has(email)) {
          individualMap.set(email, { count: 1, id: contactId, alias: contactAlias });
        } else {
          const entry = individualMap.get(email);
          entry.count += 1;
        }
      }
    }
    return {
      multiShared: multiSharedNotes,
      individualGroups: Array.from(individualMap.entries()).map(([email, { count, id, alias }]) => ({ email, count, id, alias })),
      privateCount: priv,
    };
  }, [notes, contacts]);

  if (individualGroups.length === 0 && multiShared.length === 0 && privateCount === 0) {
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
      {multiShared.length > 0 && (
        <SharedRecipientCard
          key="multi-shared"
          email="Varios"
          count={multiShared.length}
          alias="Varios"
          onClick={e => {
            if (e.target.tagName === 'INPUT') return;
            ownerId && navigate(`/shared/${ownerId}?recipient=multi-shared`);
          }}
        />
      )}
      {individualGroups.map(({ email, count, id, alias }) => (
        <SharedRecipientCard
          key={email}
          id={id}
          email={email}
          count={count}
          alias={alias}
          onClick={e => {
            if (e.target.tagName === 'INPUT') return;
            ownerId && navigate(`/shared/${ownerId}?recipient=${encodeURIComponent(email)}`);
          }}
        />)
      )}
    </div>
  );
}
