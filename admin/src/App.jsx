







// import { useState } from "react";
// import Navbar from "./components/Navbar/Navbar";
// import Sidebar from "./components/Sidebar/Sidebar";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Add from "./pages/Add/Add";
// import OrdersPage from "./pages/Order/Order";
// import List from "./pages/List/List";

// import { ToastContainer } from "react-toastify";

// function App() {
//   return (
//     <>
//       <div>
//         <ToastContainer />
//         <Navbar />
//         <hr />

//         <div className="app-content">
//           <Sidebar />

//           <Routes>
//             {/* ✅ FIX: default route */}
//             <Route path="/" element={<Navigate to="/add" />} />

//             <Route path="/add" element={<Add />} />
//             <Route path="admin/order" element={<OrdersPage />} />
//             <Route path="/list" element={<List />} />
//           </Routes>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;


































import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import OrdersPage from "./pages/Order/Order";
import List from "./pages/List/List";
import { ToastContainer } from "react-toastify";

import {useNavigate} from 'react-router-dom';




function App() {
 
const navigate = useNavigate();

//lets add security when user doesnot have accesssToken and he can go back to main app (for non-login user)

useEffect(()=>{
  const token =  localStorage.getItem('accessToken');
  if(!token){
    // No token = not logged in, redirect to main app
      window.location.href = "http://localhost:5173";
  }
},[])

  
  

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
            <Route path="admin/order" element={<OrdersPage />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;