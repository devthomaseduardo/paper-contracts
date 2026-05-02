import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtOFqorKYtQ1--lzefOzvrKDeNfLHxbZE",
  authDomain: "project-d6da2b67-cebc-4d94-957.firebaseapp.com",
  projectId: "project-d6da2b67-cebc-4d94-957",
  storageBucket: "project-d6da2b67-cebc-4d94-957.firebasestorage.app",
  messagingSenderId: "327648724311",
  appId: "1:327648724311:web:140e477514800c200dea12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Adicionando um escopo básico
provider.addScope('profile');
provider.addScope('email');

export const signInWithGoogle = async () => {
    try {
        return await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Popup failed, trying redirect...", error);
        return await signInWithRedirect(auth, provider);
    }
};

export const logout = () => signOut(auth);
