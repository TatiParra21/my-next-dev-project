
import React from "react"
import { useLocation, NavLink } from "react-router-dom"
import { googleAuthStore } from "@renderer/store/projectStore";
import { useState,useEffect } from "react";
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
     try {
        window.electron.startGoogleLogin();

  } catch (err: any) {
    console.error("❌ Google Sign-In Error:", err);

    // 👇 Make sure we show the exact error message
    const message =
      err.code || err.message
        ? `${err.code || ""}: ${err.message || ""}`
        : "Unknown error";

    // Save to screen and also make a visible alert
    setAuthError(`Failed to sign in: ${message}`);
    alert(`Google sign-in failed:\n${message},"Current origin: " + ${window.location.origin}`);
  }
  };
   useEffect(() => {
    // Listen for deep link event from main process
    window.electron.onAuthToken(async(url: string) => {
      console.log("Received deep link:", url);
     try {
        await googleAuthStore.getState().handleRedirect(url);
       // alert("✅ Logged in successfully!");
      } catch (err) {
        console.error("❌ Deep link handling failed:", err);
        alert("Login failed. Please try again.");
      }
    
      
    });
  }, []);
    const handleLogin=async(e: React.FormEvent<HTMLFormElement>)=>{
     /*
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const email = formData.get("email") as string
         const password = formData.get("password") as string
         */
      //setAuthError(errorMessage);
      //console.error("❌ Auth error:", err.code, err.message);
        e.preventDefault();
  alert("Email/password login is no longer supported. Please use Google Sign-In instead.");  

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

