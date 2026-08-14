
import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import OrdersPage from "./pages/Order/Order";
import List from "./pages/List/List";
import { ToastContainer } from "react-toastify";
import adminApi from "./Api/axios.admin";
import Users from "./pages/User/Alluser";
import Dashboard from "./pages/Dashboard/Dashboard";
function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkadminAccess = async () => {


      try {


        const res = await adminApi.get("/user/admin/me", {
          withCredentials: true,
        });

        setCheckingAuth(false);
      } catch (error) {


        window.location.replace("http://localhost:5173");
      }
    };

    checkadminAccess();
  }, []);

  if (checkingAuth) {

    return <p>Checking access ....</p>;
  }


  return (
    <>
      <div>

        <ToastContainer />
        <Navbar />

        <hr />

        <div className="app-content">
          <Sidebar />

          <Routes>
            <Route path="/" element={<Navigate to="/add" />} />
            <Route path="/add" element={<Add />} />
            <Route path="/admin/order" element={<OrdersPage />} />
            <Route path="/list" element={<List />} />
            <Route path="/all-user" element={<Users/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
