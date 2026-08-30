import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";
import AdminOrderDetails from "./components/Order/AdminOrderDetailPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import OrdersPage from "./pages/Order/Order";
import Users from "./pages/User/Alluser";
import AdminLogin from "./components/Auth/Login";

// ================= ADMIN LAYOUT =================

function AdminLayout() {
  return (
    <div>
      <Navbar />

      <hr />

      <div className="app-content">
        <Sidebar />

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ================= APP =================

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public */}

        <Route path="/login" element={<AdminLogin />} />

        {/* Protected */}

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/add" element={<Add />} />

            <Route path="/admin/order" element={<OrdersPage />} />

            <Route path="/list" element={<List />} />

            <Route path="/all-user" element={<Users />} />
            <Route
              path="/admin/orders/:orderId"
              element={<AdminOrderDetails />}
            />
          </Route>
        </Route>

        {/* Root */}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Unknown route */}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
