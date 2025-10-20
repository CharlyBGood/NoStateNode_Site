import { useMemo, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SharedRecipientCard from "./SharedRecipientCard";

export default function SharedRecipientsGrid({ notes, contacts, isOwner }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ownerId = userIdFromContextOrProp(); // helper para obtener el ownerId

  function userIdFromContextOrProp() {
    // Si es owner, user.uid; si no, ownerId de los contactos
    if (isOwner && user) return user.uid;
    if (contacts && contacts.length > 0) return contacts[0].ownerId;
    return null;
  }

  const { groupCards, individualGroups, privateCount } = useMemo(() => {
    let priv = 0;
    const groupMap = new Map();
    const individualMap = new Map();
    for (const n of notes) {
      const list = Array.isArray(n.shareWith) ? n.shareWith : [];
      if (list.length === 0) {
        priv += 1;
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
      } else if (list.length > 1) {
        const sorted = [...list].sort();
        const key = JSON.stringify(sorted);
        if (!groupMap.has(key)) {
          groupMap.set(key, { emails: sorted, notes: [n] });
        } else {
          groupMap.get(key).notes.push(n);
        }
      }
    }
    return {
      groupCards: Array.from(groupMap.entries()).map(([key, { emails, notes }]) => ({ key, emails, count: notes.length, notes })),
      individualGroups: Array.from(individualMap.entries()).map(([email, { count, id, alias }]) => ({ email, count, id, alias })),
      privateCount: priv,
    };
  }, [notes, contacts]);

  const [groupAliases, setGroupAliases] = useState({});
  useEffect(() => {
    async function fetchAliases() {
      const aliases = {};
      for (const { key } of groupCards) {
        try {
          const snap = await getDoc(doc(db, "sharedGroups", key));
          if (snap.exists()) {
            aliases[key] = snap.data().alias || null;
          }
        } catch { }
      }
      setGroupAliases(aliases);
    }
    if (groupCards && groupCards.length > 0) {
      fetchAliases();
    }
  }, [groupCards]);

  if (individualGroups.length === 0 && groupCards.length === 0 && privateCount === 0) {
    return <p>No hay notas aún. ¡Crea una y compártela con tus contactos!</p>;
  }

  return (
    <div className="task-list-container">
      {privateCount > 0 && ownerId && (
        <SharedRecipientCard
          key="__private__"
          id={ownerId}
          email="Solo tú"
          count={privateCount}
          alias={(contacts.find(c => c.email === user.email)?.alias) || ""}
          onClick={() => navigate(`/shared/${ownerId}?recipient=${encodeURIComponent("__private")}`)}
        />
      )}
      {groupCards.map(({ key, emails, count }) => (
        <SharedRecipientCard
          key={key}
          email={groupAliases[key] || (emails.length > 2 ? "Varios" : emails.join(", "))}
          count={count}
          alias={groupAliases[key] || (emails.length > 2 ? "Varios" : emails.join(", "))}
          groupKey={key}
          groupEmails={emails}
          onClick={e => {
            if (e.target.tagName === 'INPUT') return;
            if (isOwner && ownerId) {
              navigate(`/shared/${ownerId}?recipient=${encodeURIComponent(key)}`);
            } else if (ownerId) {
              navigate(`/shared/${ownerId}/list/${encodeURIComponent(key)}`);
            }
          }}
        />
      ))}
      {individualGroups.map(({ email, count, id, alias }) => (
        <SharedRecipientCard
          key={email}
          id={id}
          email={email}
          count={count}
          alias={alias}
          onClick={e => {
            if (e.target.tagName === 'INPUT') return;
            if (isOwner && ownerId) {
              navigate(`/shared/${ownerId}?recipient=${encodeURIComponent(email)}`);
            } else if (ownerId) {
              navigate(`/shared/${ownerId}/list/${encodeURIComponent(email)}`);
            }
          }}
        />)
      )}
    </div>
  );
}
