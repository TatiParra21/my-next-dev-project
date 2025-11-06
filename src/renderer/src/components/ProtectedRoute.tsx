
import { Navigate } from "react-router-dom";
import { googleAuthStore, selectUser,  } from "@renderer/store/projectStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute =({children}:ProtectedRouteProps)=>{
    const user = googleAuthStore(selectUser)
  
    if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }
 
  return <>{children}</>;
}