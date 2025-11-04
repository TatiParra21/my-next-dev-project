import { Navigate } from "react-router-dom";
import { googleAuthStore, selectUser,} from "@renderer/store/projectStore";
export const LoggedInRoute =({ children }: { children: React.ReactNode })=>{
      const user = googleAuthStore(selectUser)
      
  // Redirect if user is already logged in
  console.log("helelo", user)
  if (user ) {   
    console.log(user, "there waas user") 
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>


}