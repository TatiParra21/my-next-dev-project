import { Navigate } from "react-router-dom";

import { googleAuthStore, selectAuthLoading, selectUser,} from "@renderer/store/projectStore";
import { LoadingRoller } from "./LoadingRoller";
import { JSX } from "react";
export const LoggedInRoute =({ children }: { children: React.ReactNode }):JSX.Element=>{
      const user = googleAuthStore(selectUser)
      const loading = googleAuthStore(selectAuthLoading)
      
  // Redirect if user is already logged in
  console.log("helelo", user)
  if (user ) {   
    console.log(user, "there waas user") 
    return <Navigate to="/dashboard" replace />;
  }
if(loading)return <LoadingRoller/>
  return <>{children}</>


}