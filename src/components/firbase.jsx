import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS5vYaZxU4bOlWZZ_z7VtGvwUu92A2B5A",
  authDomain: "vmovies-2109e.firebaseapp.com",
  projectId: "vmovies-2109e",
  storageBucket: "vmovies-2109e.firebasestorage.app",
  messagingSenderId: "290921321601",
  appId: "1:290921321601:web:8762a724892f0f5272a980",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
