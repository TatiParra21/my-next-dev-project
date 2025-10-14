import { Navigate } from "react-router-dom";
import { firebaseStore, selectUser, selectUserId} from "@renderer/store/projectStore";
export const LoggedInRoute =({ children }: { children: React.ReactNode })=>{
      const user = firebaseStore(selectUser)
      const userId = firebaseStore(selectUserId)
  // Redirect if user is already logged in
  if (user && userId ) {   
    console.log(user, "there waas user") 
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>


}