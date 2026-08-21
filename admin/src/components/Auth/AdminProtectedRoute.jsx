import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const token = localStorage.getItem("adminToken");

  const user = JSON.parse(
    localStorage.getItem("adminUser") || "null",
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
