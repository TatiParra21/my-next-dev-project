
import React, { JSX } from "react"
import { useLocation, NavLink } from "react-router-dom"

declare global {
  interface Window {
   authAPI: {
     oauthGoogle: () => Promise<{ success: boolean; url?: string; message?: string }>
    }
  }
}
export interface GoogleAuthResult {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
}

import { generatePKCEPair } from "@renderer/functions/generatePKCEPair";

export const LoginForm =():JSX.Element=>{
  const location = useLocation()
  const params = location.pathname
  console.log("startGoogleLogin:", window.api?.startGoogleLogin);
  //const [authError, setAuthError] = useState<string | null>(null);
  console.log("Current origin is:", window.location.origin); 
  const signInWithGoogle = async ():Promise<void> => {
      const { codeVerifier, codeChallenge } = await generatePKCEPair();
    const result = await window.api.startGoogleLogin(
      codeVerifier,
      codeChallenge
    );
   

    if (result?.access_token) {
     console.log(result?.access_token)
    }
  };
  

    const handleLogin=async(e: React.FormEvent<HTMLFormElement>):Promise<void>=>{
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
        
        </>
    )
}

