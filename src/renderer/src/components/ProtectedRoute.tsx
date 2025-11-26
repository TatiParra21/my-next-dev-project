
import { Navigate } from "react-router-dom";
import { googleAuthStore, selectUser,  } from "@renderer/store/projectStore";
import { JSX } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute =({children}:ProtectedRouteProps):JSX.Element=>{
    const user = googleAuthStore(selectUser)
  
    if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }
 
  return <>{children}</>;
}