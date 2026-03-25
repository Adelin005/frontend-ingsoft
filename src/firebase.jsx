import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configurația ta reală
export const firebaseConfig = {
  apiKey: "AIzaSyAu0jc0oPGDcMccGk-JFfr7sy9_9Nj2xLQ",
  authDomain: "university-website-fe21d.firebaseapp.com",
  projectId: "university-website-fe21d",
  storageBucket: "university-website-fe21d.firebasestorage.app",
  messagingSenderId: "1023460150143",
  appId: "1:1023460150143:web:b65e7385ff35743133e84a",
  measurementId: "G-7F3NH8ZV4K"
};

// Inițializăm Firebase
const app = initializeApp(firebaseConfig);

// EXPORTĂM serviciile (fără Analytics, ca să nu mai dea eroare)
export const auth = getAuth(app);
export const db = getFirestore(app);