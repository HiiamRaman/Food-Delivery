import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets.js";
import { NavLink } from "react-router-dom";
import { Users, LayoutDashboard } from "lucide-react";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-options">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className="sidebar-option"
        >
          <LayoutDashboard size={22} />
          <p>Dashboard</p>
        </NavLink>


        {/* Add Food */}
        <NavLink
          to="/add"
          className="sidebar-option"
        >
          <img
            src={assets.add_icon}
            alt=""
          />
          <p>Add Item</p>
        </NavLink>


        {/* Food List */}
        <NavLink
          to="/list"
          className="sidebar-option"
        >
          <img
            src={assets.order_icon}
            alt=""
          />
          <p>List Item</p>
        </NavLink>


        {/* Orders */}
        <NavLink
          to="/admin/order"
          className="sidebar-option"
        >
          <img
            src={assets.order_icon}
            alt=""
          />
          <p>Orders</p>
        </NavLink>


        {/* Users */}
        <NavLink
          to="/all-user"
          className="sidebar-option"
        >
          <Users size={22} />
          <p>All Users</p>
        </NavLink>

      </div>
    </div>
  );
}

export default Sidebar;
