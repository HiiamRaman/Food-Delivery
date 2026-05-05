import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets.js";

function Navbar() {
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    window.location.replace ("http://localhost:5173");
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Logo" />
      
      <div className="navbar-right">
        <div className="admin-badge">👨‍💼 Admin</div>
        <img className="profile" src={assets.profile_image} alt="Profile" />
        <button onClick={handleLogOut} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;