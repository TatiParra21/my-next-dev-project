
import React from "react"
import { useLocation, NavLink } from "react-router-dom"
import { auth, googleProvider  } from "@renderer/firebaseClient";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
declare global {
  interface Window {
   authAPI: {
     oauthGoogle: () => Promise<{ success: boolean; url?: string; message?: string }>
    }
  }
}

export const LoginForm =()=>{
  const location = useLocation()
  const params = location.pathname
  const [authError, setAuthError] = useState<string | null>(null);
  console.log("Current origin is:", window.location.origin); 
  const signInWithGoogle = async () => {
    console.clear();
    console.log("🟢 Starting Google sign-in...");
    
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("✅ Google sign-in complete:", user.email);
    const idToken = await user.getIdToken();
    console.log("🪪 Firebase ID Token:", idToken.slice(0, 60) + "...");
  } catch (err: any) {
    console.error("💥 Popup sign-in error:", err.message);
    setAuthError(err.message);
    }  
  }
    const handleLogin=async(e: React.FormEvent<HTMLFormElement>)=>{
     
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const email = formData.get("email") as string
         const password = formData.get("password") as string
         try {
      if (params === "/sign-in") {
        console.log("🔐 Signing in with email...");
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        console.log("🆕 Signing up new user...");
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Zustand’s initAuth() will update automatically on success
    } catch (err: any) {
      let errorMessage = err.message;
      switch (err.code) {
    case "auth/user-not-found":
      errorMessage = "No account found with this email. Try signing up instead.";
      break;
    case "auth/wrong-password":
      errorMessage = "Incorrect password. Please try again.";
      break;
    case "auth/email-already-in-use":
      errorMessage = "This email is already registered. Please sign in.";
      break;
    case "auth/invalid-credential":
      errorMessage =
        "This account uses Google sign-in. Please sign in with Google instead.";
      break;
  }
      setAuthError(errorMessage);
      console.error("❌ Auth error:", err.code, err.message);
    }

}
    return(
        <>
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
            type="email"
            defaultValue=""
            name="email"
            id="email-input"
            ></input>
            <label htmlFor="password">Password</label>
            <input
            type="password"
            defaultValue=""
            name="password"
            id="password-input"
            ></input>
            <button type="submit">Submit</button>
        </form>
        <button onClick={signInWithGoogle}>Sign in With Google</button>
        {params == "/" && <p>{`Already have an account?`}<NavLink to="sign-in">Sign In</NavLink></p>}
         {params == "/sign-in" && <p>{`Don't have an account?`}<NavLink to="/">Sign Up</NavLink></p>}     
        {authError && <p>{authError}</p>}
        </>
    )
}

