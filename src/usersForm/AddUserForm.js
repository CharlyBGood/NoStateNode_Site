import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const AddUserForm = ({ onContactAdded }) => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const validateEmail = (email) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // }

  const handleAddUser = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const usersRef = collection(db, "usersToShare");
        const q = query(
          usersRef,
          where("ownerId", "==", currentUser.uid),
          where("email", "==", email.trim())
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          const newContact = {
            email: email.trim(),
            ownerId: currentUser.uid,
            createdAt: new Date(),
          };
          await addDoc(usersRef, newContact);
          alert("usuario añadido")
          setEmail("");
          setIsModalOpen(false);
          onContactAdded();
        } else {
          alert("no se pudo añadir el usuario");
        }
      } catch (err) {
        console.error(err);
        alert("error adding")
      }
    }
  };

  return (
    <>
      <div className="share-btn-container">
        <button className="share-btn task-btn" onClick={() => setIsModalOpen(true)}>
          Añadir contacto
        </button>
      </div>

      {isModalOpen &&
        <form id="users-form" onSubmit={handleAddUser} className="task-form">
          <input
            id="contact email"
            className="task-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="share-btn-container">
            <button className="log-btn border-none font-bold block border rounded mb-2 py-2 px-4 w-full" type="submit">
              Añadir contacto
            </button>
            <button type="button" className="btn-cancel font-bold block rounded mb-2 py-2 px-4 w-full" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      }
    </>
  );
};

export default AddUserForm;