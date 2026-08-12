import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileDropdown from "./profiledropdown";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

function Navbar({ setShowLogin }) {
  const [menu, setMenu] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { getCartTotal, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setIsDropdownOpen(false);

    toast.success("Logged out successfully");

    navigate("/");
  };

  const handleHomeClick = () => {
    setMenu("Home");
    setIsDropdownOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navItems = [
    {
      id: "Home",
      label: "Home",
      type: "link",
      path: "/",
    },
    {
      id: "Menu",
      label: "Menu",
      type: "anchor",
      path: "#explore-menu",
    },
    {
      id: "MobileApp",
      label: "Get App",
      type: "anchor",
      path: "#app-download",
    },
    {
      id: "Contact",
      label: "Contact",
      type: "anchor",
      path: "#footer",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="group flex items-center"
        >
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Raman
            <span className="text-orange-500 transition group-hover:text-orange-600">
              .
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = menu === item.id;

              const navClass = `
                relative py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }
              `;

              return (
                <li key={item.id}>
                  {item.type === "link" ? (
                    <Link
                      to={item.path}
                      onClick={handleHomeClick}
                      className={navClass}
                    >
                      {item.label}

                      {isActive && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-orange-500" />
                      )}
                    </Link>
                  ) : (
                    <a
                      href={item.path}
                      onClick={() => setMenu(item.id)}
                      className={navClass}
                    >
                      {item.label}

                      {isActive && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-orange-500" />
                      )}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
          >
            <img
              src={assets.search_icon}
              alt=""
              className="h-5 w-5 opacity-80"
            />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          >
            <img
              src={assets.basket_icon}
              alt=""
              className="h-5 w-5 opacity-80"
            />

            {getCartTotal() > 0 && (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-orange-500" />
            )}
          </Link>

          {/* Authentication */}
          {!token ? (
            <button
  type="button"
  onClick={() => setShowLogin(true)}
  className="
    ml-2
    w-20
    h-8

    rounded-full
    bg-slate-900
    px-10 py-2.5
    text-sm font-semibold
    text-white
    shadow-sm
    transition-all duration-300
    hover:-translate-y-0.5
    hover:bg-orange-500
    hover:shadow-md
    active:translate-y-0
    active:scale-95
  "
>
  Sign In
</button>
          ) : (
            <div ref={dropdownRef} className="relative ml-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  isDropdownOpen
                    ? "border-orange-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img
                  src={assets.profile_icon}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <ProfileDropdown
                  onLogout={handleLogout}
                  onClose={() => setIsDropdownOpen(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
