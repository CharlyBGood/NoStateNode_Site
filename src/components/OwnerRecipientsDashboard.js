import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import SharedRecipientsGrid from "./SharedRecipientsGrid";

export default function OwnerRecipientsDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const tasksRef = collection(db, "notes");
    const q = query(tasksRef, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotes(data);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return <SharedRecipientsGrid notes={notes} />;
}
