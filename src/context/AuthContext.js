import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no AuthProvider");
  return context;
};

export function AuthProvider({ children }) {

  const [user, setUser ] = useState(null);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    })
  }, [])


  return (
    <authContext.Provider value={{ signup, login, user }}>
      {children}
    </authContext.Provider>
  );
}
