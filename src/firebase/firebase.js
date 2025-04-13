// Importar funciones necesarias
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mytasks-68afa.firebaseapp.com",
  projectId: "mytasks-68afa",
  storageBucket: "mytasks-68afa.appspot.com", // ← CORRECTO
  messagingSenderId: "1058989959695",
  appId: "1:1058989959695:web:4a29bced29e259bb2a517a",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
