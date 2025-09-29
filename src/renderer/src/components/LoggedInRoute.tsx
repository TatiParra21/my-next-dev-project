import { Navigate } from "react-router-dom";
import { supabaseStore } from "@renderer/store/projectStore";
import { JSX } from "react";
export const LoggedInRoute =({ children }: { children: React.ReactNode })=>{
      const session = supabaseStore(state => state.session);
  
  // Redirect if user is already logged in
  if (session) {
    console.log(session.user,  "sessionn")
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>


}