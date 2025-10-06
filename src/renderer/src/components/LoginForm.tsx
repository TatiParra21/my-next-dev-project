import { supabase } from "@renderer/supabaseClient"
import React from "react"
import { supabaseStore } from "@renderer/store/projectStore"
import { useLocation, NavLink } from "react-router-dom"
export const LoginForm =()=>{
  
     const location = useLocation()
     const params = location.pathname
     console.log(params)
      const authError = supabaseStore(state=>state.authError)
      const setAuthError = supabaseStore(state=>state.setAuthError)
  const signInWithGoogle=async()=> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
       skipBrowserRedirect: true,  
      queryParams: { access_type: 'offline' }, 
    }
  })
  
    if(error){
        setAuthError(`Google sign in error: ${error.message}`, )
        }else if (data?.url) {
          console.log(data.url, "data url exists")
    // Call the preload API → sends IPC to main process
    ;(window as any).electronAPI.openGoogleLogin(data.url)
    setAuthError("Redirecting to Google login...")
  }
}
    const handleLogin=async(e: React.FormEvent<HTMLFormElement>)=>{
     
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const email = formData.get("email") as string
         const password = formData.get("password") as string
         console.log(email, password)
         let errorMessage
         const {data, error} = params =="/sign-in" ? await supabase.auth.signInWithPassword({email, password}) : await supabase.auth.signUp({email, password})
        if (error) {        
    // Special case: Google-linked account trying email login
    if (
      params === "sign-in" &&
      error.message.toLowerCase().includes("invalid login credentials")
    ){
      errorMessage = "This email is linked with Google. Please sign in with Google instead."
    } else {
      errorMessage = error.message
    }
    setAuthError(errorMessage)
    return
  } if (!data.session) {
    console.log(data,"data")
          if(data.user && params == "/" && !data.session){
                setAuthError("Verification email was sent")
                return
            }
            if (data.user?.aud === "authenticated") {
              errorMessage = !data.user.user_metadata.provider ? "Account already exists, please sign in."
              : !data.user.user_metadata?.email_verified ? "Email has not been verified yet." : "Unknown Error"
            }else{
              errorMessage  = "No session returned. Check credentials."}
            setAuthError(errorMessage)
            return
          }  
            console.log(data, "data")
        
        

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

