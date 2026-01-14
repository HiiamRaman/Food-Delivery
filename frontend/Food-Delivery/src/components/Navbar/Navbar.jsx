import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
function Navbar({ setShowLogin }) {
  const [menu, setMenu] = useState("Home");

  const { getCartTotal, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate()
  const handlleLogout = ()=>{
    localStorage.removeItem("accessToken");
    setToken(null);
    navigate("/")
  }

  return (
    <div className="navbar">
      <Link to={"/"}>
        {" "}
        <img src={assets.logo} alt="" className="logo" />{" "}
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => {
            setMenu("Home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={menu === "Home" ? "active" : ""}
        >
          Home
        </Link>

        <a
          href="#explore-menu"
          onClick={() => {
            setMenu("Menu");
          }}
          className={menu === "Menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => {
            setMenu("MobileApp");
          }}
          className={menu === "MobileApp" ? "active" : ""}
        >
          MobileApp
        </a>
        <a
          href="#footer"
          onClick={() => {
            setMenu("ContactUs");
          }}
          className={menu === "ContactUs" ? "active" : ""}
        >
          ContactUs
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to={"/cart"}>
            {" "}
            <img src={assets.basket_icon} alt="" />{" "}
          </Link>
          <div className={getCartTotal() === 0 ? "" : "dot"}></div>
        </div>
      </div>
      {!token ? (
        <button onClick={() => setShowLogin(true)}>sign in</button>
      ) : (
        <div className="nav-bar-profile">
          <img src={assets.profile_icon} alt="" />
          <ul className="nav-bar-dropdown">
            <li>
              {" "}
              <img src={assets.bag_icon} alt="" /> <p>Orders</p>{" "}
            </li>
            <hr />
            <li onClick={handlleLogout}>
              {" "}
              <img    src={assets.logout_icon} alt="" /> <p>Logout</p>{" "}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
