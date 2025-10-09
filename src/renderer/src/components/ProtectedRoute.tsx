import React from "react";
import { Navigate } from "react-router-dom";
import { firebaseStore, selectUser,  selectFirebaseLoading, selectUserId } from "@renderer/store/projectStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute =({children}:ProtectedRouteProps)=>{
    const user = firebaseStore(selectUser)
    const userId = firebaseStore(selectUserId)
    const loading = firebaseStore(selectFirebaseLoading)
      if (loading) {
    return <div>Loading...</div>;
  }
    if (!user || !userId) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }
 
  return <>{children}</>;
}