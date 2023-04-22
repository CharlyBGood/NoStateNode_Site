// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
