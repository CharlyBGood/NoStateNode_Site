import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

// Utilidad centralizada para obtener el título/alias correcto
export async function getListTitle({ db, userId, recipient, userEmail }) {
  if (!userId || !recipient) return "";
  if (recipient === "__private") {
    // Card privada
    const docRef = doc(db, "usersToShare", userId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data().alias || "Solo tú") : "Solo tú";
  }
  if (userEmail && recipient === userEmail) {
    // Card individual
    const contactsRef = collection(db, "usersToShare");
    const q = query(contactsRef, where("ownerId", "==", userId), where("email", "==", userEmail));
    const snap = await getDocs(q);
    return !snap.empty ? (snap.docs[0].data().alias || userEmail) : userEmail;
  }
  if (recipient.startsWith("[")) {
    // Grupo
    const groupRef = doc(db, "sharedGroups", recipient);
    const groupSnap = await getDoc(groupRef);
    return groupSnap.exists() ? (groupSnap.data().alias || "Grupo compartido") : "Grupo compartido";
  }
  // Fallback
  return recipient;
}