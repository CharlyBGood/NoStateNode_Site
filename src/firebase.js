// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCimRXhdhhMo50Ejd2zcUpSgCP-ULHArUk",
  authDomain: "fir-login-80f6c.firebaseapp.com",
  projectId: "fir-login-80f6c",
  storageBucket: "fir-login-80f6c.appspot.com",
  messagingSenderId: "642662965543",
  appId: "1:642662965543:web:3a7600c2877f54db1ec902",
  measurementId: "G-KX817TK10Z",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
