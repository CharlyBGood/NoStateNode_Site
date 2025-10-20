import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import TaskList from "../formPages/TaskList";
import "../stylesheets/TaskList.css";
import SharedRecipientsGrid from "./SharedRecipientsGrid";
import { getListTitle } from "../utilities/getListTitle";

export function SharedTasksPage() {
  const { userId, listId } = useParams();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [listTitle, setListTitle] = useState("");
  const [contacts, setContacts] = useState([]);

  const memoRecipient = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("recipient");
    return r ? decodeURIComponent(r) : null;
  }, [location.search]);
  const recipient = listId ? decodeURIComponent(listId) : memoRecipient;

  useEffect(() => {
    if (loading || !user) return;

    const tasksRef = collection(db, "notes");
    const isOwner = user.uid === userId;

    let q;
    let filterFn = (arr) => arr;
    if (!isOwner) {
      const contactsRef = collection(db, "usersToShare");
      getDocs(query(contactsRef, where("ownerId", "==", userId))).then(snap => {
        setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }
    if (isOwner) {
      if (recipient === "__private") {
        q = query(tasksRef, where("userId", "==", userId));
        filterFn = (arr) => arr.filter((d) => !Array.isArray(d.shareWith) || d.shareWith.length === 0);
      } else if (recipient) {
        q = query(
          tasksRef,
          where("userId", "==", userId),
          where("shareWith", "array-contains", recipient)
        );
      } else {
        q = query(tasksRef, where("userId", "==", userId));
      }
    } else {
      q = query(
        tasksRef,
        where("userId", "==", userId),
        where("shareWith", "array-contains", user.email)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(filterFn(tasksData));
    });

    return () => unsubscribe();
  }, [userId, user, loading, recipient]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/Welcome");
    }
  }, [loading, user, navigate]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/Home');
    }
  };

  const isOwner = user && user.uid === userId;

  useEffect(() => {
    let active = true;
    async function fetchTitle() {
      if (!userId || !recipient || isOwner) {
        setListTitle("");
        return;
      }
      const title = await getListTitle({ db, userId, recipient, userEmail: user?.email });
      if (active) setListTitle(title);
    }
    fetchTitle();
    return () => { active = false; };
  }, [userId, recipient, user, isOwner]);

  if (isOwner && !recipient) {
    return (
      <div className="todo-list-main">
        <div className="back-btn-container">
          <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
        </div>
        <SharedRecipientsGrid notes={tasks} />
      </div>
    );
  }
  if (!isOwner && !recipient) {
    const filteredNotes = tasks.filter(
      (n) => Array.isArray(n.shareWith) && n.shareWith.includes(user.email)
    );
    return (
      <div className="todo-list-main">
        <div className="back-btn-container">
          <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
        </div>
        <div className="shared-list-header">
          Estos son los recursos compartidos para <b>{user ? (user.displayName || user.email) : "Invitado"}</b>
        </div>
        <SharedRecipientsGrid notes={filteredNotes} contacts={contacts} isOwner={false} />
      </div>
    );
  }

  if (isOwner && recipient) {
    return (
      <div className="todo-list-main">
        <div className="back-btn-container">
          <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
        </div>
        <div className="shared-list-header">
          Estas viendo la lista compartida para <b>{listTitle || recipient}</b>
        </div>
        <TaskList filterRecipient={recipient} isReadOnly={false} />
      </div>
    );
  }

  if (!isOwner && recipient) {
    if (!user) {
      return (
        <div className="todo-list-main">
          <div className="back-btn-container">
            <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
          </div>
          <div className="shared-list-header">
            Debes iniciar sesión para ver esta lista compartida.
          </div>
        </div>
      );
    }

    return (
      <div className="todo-list-main">
        <div className="back-btn-container">
          <button type="button" className="task-btn back-btn" onClick={handleBack}>← Volver</button>
        </div>
        <div className="shared-list-header">
          Estas viendo la lista compartida para <b>{listTitle || recipient}</b>
        </div>
        <TaskList filterRecipient={user.email} isReadOnly={true} ownerId={userId} />
      </div>
    );
  }
}

export default SharedTasksPage;