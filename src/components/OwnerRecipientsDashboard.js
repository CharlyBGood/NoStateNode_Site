import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import SharedRecipientsGrid from "./SharedRecipientsGrid";

export default function OwnerRecipientsDashboard() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [invitedNotes, setInvitedNotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const tasksRef = collection(db, "notes");
    // Propias
    const q = query(tasksRef, where("userId", "==", user.uid));
    const unsubscribeOwn = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data(), isInvited: false }));
      setNotes(data);
    });
    // Invitado: solo filtra en memoria userId !== user.uid
    const qInvited = query(tasksRef, where("shareWith", "array-contains", user.email));
    const unsubscribeInvited = onSnapshot(qInvited, (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data(), isInvited: true }))
        .filter((d) => d.userId !== user.uid);
      setInvitedNotes(data);
    });
    return () => {
      unsubscribeOwn();
      unsubscribeInvited();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const contactsRef = collection(db, "usersToShare");
    const q = query(contactsRef, where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setContacts(data);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) return null;
  // Combina propias y invitadas
  return <SharedRecipientsGrid notes={[...notes, ...invitedNotes]} contacts={contacts} loading={loading} />;
}
