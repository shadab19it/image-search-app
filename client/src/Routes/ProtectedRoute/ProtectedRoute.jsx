import React from "react";
import { Navigate, Route } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = isAuthenticated();
  if (!isLoggedIn) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
