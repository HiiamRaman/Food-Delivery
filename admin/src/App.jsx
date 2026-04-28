// import { useState } from "react";
// import Navbar from "./components/Navbar/Navbar";
// import Sidebar from "./components/Sidebar/Sidebar";
// import { Routes, Route } from "react-router-dom";
// import Add from "./pages/Add/Add";
// import Order from "./pages/Order/Order";
// import List from "./pages/List/List";

// import { ToastContainer, toast } from "react-toastify";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <div>
//         <ToastContainer/>
//         <Navbar />
//         <hr />
//         <div className="app-content">
//           <Sidebar />
//           <Routes>
//        
//             <Route path="/add" element={<Add />} />
//             <Route path="/order" element={<Order />} />
//             <Route path="/list" element={<List />} />
//           </Routes>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;









import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import OrdersPage from "./pages/Order/Order";
import List from "./pages/List/List";

import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Navbar />
        <hr />

        <div className="app-content">
          <Sidebar />

          <Routes>
            {/* ✅ FIX: default route */}
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