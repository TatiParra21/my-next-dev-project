import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider,browserLocalPersistence , setPersistence, } from "firebase/auth"

// Replace with your config from Firebase Console
 const firebaseConfig = {
 apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
 authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 
 projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
 };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
});

setPersistence(auth, browserLocalPersistence);