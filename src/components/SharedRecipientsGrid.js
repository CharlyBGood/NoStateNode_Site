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
          individualMap.set(email, { count: 1, id: contactId, alias: contactAlias, isInvited: n.isInvited });
        } else {
          const entry = individualMap.get(email);
          entry.count += 1;
          entry.isInvited = entry.isInvited || n.isInvited;
        }
      } else if (list.length > 1) {
        const sorted = [...list].sort();
        const key = JSON.stringify(sorted);
        // Siempre usar key ordenado
        if (!groupMap.has(key)) {
          groupMap.set(key, { emails: sorted, notes: [n], isInvited: n.isInvited });
        } else {
          const group = groupMap.get(key);
          group.notes.push(n);
          group.isInvited = group.isInvited || n.isInvited;
        }
      }
    }
    return {
      groupCards: Array.from(groupMap.entries()).map(([key, { emails, notes, isInvited }]) => ({ key, emails, count: notes.length, notes, isInvited })),
      individualGroups: Array.from(individualMap.entries()).map(([email, { count, id, alias, isInvited }]) => ({ email, count, id, alias, isInvited })),
      privateCount: priv,
    };
  }, [notes, contacts]);

  const [groupAliases, setGroupAliases] = useState({});
  useEffect(() => {
    async function fetchAliases() {
      const aliases = {};
      for (const { emails } of groupCards) {
        const sortedKey = JSON.stringify([...emails].sort());
        try {
          const snap = await getDoc(doc(db, "sharedGroups", sortedKey));
          if (snap.exists()) {
            aliases[sortedKey] = snap.data().alias || null;
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
      {groupCards.map(({ key, emails, count, isInvited, notes }) => {
        // ownerId real para este grupo
        const groupOwnerId = notes && notes.length > 0 ? notes[0].userId : ownerId;
        // Alias de grupo: si existe en groupAliases, usarlo, si no, emails
        const sortedKey = JSON.stringify([...emails].sort());
        // Compatibilidad: buscar alias en sortedKey, luego en key original, luego en la nota
        let displayAlias = groupAliases[sortedKey];
        if (!displayAlias && groupAliases[key]) displayAlias = groupAliases[key];
        if (!displayAlias && notes && notes[0] && notes[0].alias) displayAlias = notes[0].alias;
        if (!displayAlias) displayAlias = (emails.length > 2 ? "Varios" : emails.join(", "));
        return (
          <SharedRecipientCard
            key={key}
            email={displayAlias}
            count={count}
            alias={displayAlias}
            groupKey={key}
            groupEmails={emails}
            isInvited={isInvited}
            ownerId={groupOwnerId}
            onClick={e => {
              if (e.target.tagName === 'INPUT') return;
              if (isInvited && groupOwnerId) {
                navigate(`/shared/${groupOwnerId}/list/${encodeURIComponent(key)}`, { state: { isInvited: true } });
              } else if (isOwner && groupOwnerId) {
                navigate(`/shared/${groupOwnerId}?recipient=${encodeURIComponent(key)}`);
              } else if (groupOwnerId) {
                navigate(`/shared/${groupOwnerId}/list/${encodeURIComponent(key)}`);
              }
            }}
          />
        );
      })}
      {individualGroups.map(({ email, count, id, alias, isInvited }) => {
        // Buscar ownerId real para este grupo individual
        const note = notes.find(n => Array.isArray(n.shareWith) && n.shareWith.length === 1 && n.shareWith[0] === email);
        const indivOwnerId = note ? note.userId : ownerId;
        // Buscar alias en los contactos del owner real si es invitado
        let displayAlias = alias;
        if (isInvited && indivOwnerId && email) {
          const ownerContacts = contacts?.filter(c => c.ownerId === indivOwnerId);
          const found = ownerContacts?.find(c => c.email === email);
          displayAlias = found && found.alias ? found.alias : "";
        }
        // Contar solo notas realmente compartidas con el usuario logueado si es invitado
        let realCount = count;
        if (isInvited && note && typeof window !== 'undefined') {
          const userEmail = (window.currentUserEmail || (window.firebase && window.firebase.auth && window.firebase.auth().currentUser && window.firebase.auth().currentUser.email)) || null;
          if (userEmail) {
            realCount = notes.filter(n => Array.isArray(n.shareWith) && n.shareWith.length === 1 && n.shareWith[0] === email && n.userId === indivOwnerId && n.shareWith.includes(userEmail)).length;
          }
        }
        return (
          <SharedRecipientCard
            key={email}
            id={id}
            email={email}
            count={realCount}
            alias={displayAlias}
            isInvited={isInvited}
            ownerId={indivOwnerId}
            onClick={e => {
              if (e.target.tagName === 'INPUT') return;
              if (isInvited && indivOwnerId) {
                navigate(`/shared/${indivOwnerId}/list/${encodeURIComponent(email)}`, { state: { isInvited: true } });
              } else if (isOwner && indivOwnerId) {
                navigate(`/shared/${indivOwnerId}?recipient=${encodeURIComponent(email)}`);
              } else if (indivOwnerId) {
                navigate(`/shared/${indivOwnerId}/list/${encodeURIComponent(email)}`);
              }
            }}
          />
        );
      })}
    </div>
  );
}
