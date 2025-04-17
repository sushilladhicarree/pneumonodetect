import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import { useAuth } from "../context/authContext";


const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <NavBar />
      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;