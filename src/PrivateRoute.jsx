import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); 
  // Or use context / redux / auth provider

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
