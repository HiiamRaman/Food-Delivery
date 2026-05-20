

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import OrdersPage from "./pages/Order/Order";
import List from "./pages/List/List";
import { ToastContainer } from "react-toastify";
import axios from "axios";




function App() {
 
  const [checkingAuth,setCheckingAuth] = useState(true);
  useEffect(()=>{
    const checkadminAccess = async()=>{
      try {
        await axios.get("http://localhost:3000/api/v1/user/admin/me", {
          withCredentials: true,
        })
        setCheckingAuth(false);
      } catch (error) {
        window.location.replace("http://localhost:5173");
        
      }
      checkadminAccess()
    }
  },[])
  if(checkingAuth){
    return <p>Checking access ....</p>
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
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;