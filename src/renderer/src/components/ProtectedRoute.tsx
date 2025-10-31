import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseStore, selectUser,  selectFirebaseLoading, selectUserId, selectSetLoading, projectDataStore } from "@renderer/store/projectStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute =({children}:ProtectedRouteProps)=>{
    const user = firebaseStore(selectUser)
    const userId = firebaseStore(selectUserId)
  
    if (!user || !userId) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }
 
  return <>{children}</>;
}