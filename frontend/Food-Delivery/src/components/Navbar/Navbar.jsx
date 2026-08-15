import React, { useContext, useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";

import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

function Navbar() {
  const [menu, setMenu] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  const { getCartTotal, token, setToken } = useContext(StoreContext);

  // ================= SCROLL EFFECT =================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ================= SEARCH AUTO FOCUS =================

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);

    toast.success("Logged out successfully");

    navigate("/");
  };

  // ================= HOME =================

  const handleHomeClick = () => {
    setMenu("Home");
    setIsSearchOpen(false);
    setSearchValue("");

    navigate("/");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= SEARCH =================

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchValue("");

    navigate("/");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);

    if (value.trim()) {
      navigate(
        `/food-display?search=${encodeURIComponent(value)}`,
      );
    }
  };

  // ================= NAVIGATION ITEMS =================

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
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}

        <Link
          to="/"
          onClick={handleHomeClick}
          className="group flex shrink-0 items-center"
        >
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Raman
            <span className="text-orange-500 transition group-hover:text-orange-600">
              .
            </span>
          </span>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}

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

        {/* ================= RIGHT CONTROLS ================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* ================= SEARCH ================= */}

          {isSearchOpen ? (
            <div className="flex items-center gap-1">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  placeholder="Search food..."
                  onChange={handleSearchChange}
                  className="
                    h-10
                    w-40
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-50
                    pl-4
                    pr-4
                    text-sm
                    text-slate-800
                    outline-none
                    transition-all
                    duration-300
                    placeholder:text-slate-400
                    focus:w-52
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-500/10
                    sm:w-52
                    sm:focus:w-64
                  "
                />
              </div>

              <button
                type="button"
                onClick={handleSearchClose}
                aria-label="Close search"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Search"
              onClick={handleSearchOpen}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                text-slate-600
                transition
                hover:bg-slate-100
              "
            >
              <img
                src={assets.search_icon}
                alt=""
                className="h-5 w-5 opacity-80"
              />
            </button>
          )}

          {/* ================= FAVORITES ================= */}

          {token && (
            <Link
              to="/favorites"
              aria-label="Favorites"
              title="Favorites"
              className="
                group
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                text-slate-600
                transition-all
                duration-200
                hover:bg-orange-50
                hover:text-orange-500
              "
            >
              <Heart
                size={20}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-200
                  group-hover:scale-110
                "
              />
            </Link>
          )}

          {/* ================= CART ================= */}

          <Link
            to="/cart"
            aria-label="Cart"
            title="Cart"
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              transition
              hover:bg-slate-100
            "
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

          {/* ================= AUTHENTICATION ================= */}

          {!token ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                ml-1
                h-8
                w-20
                rounded-md
                bg-slate-600
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-orange-500
                hover:shadow-md
                active:translate-y-0
                active:scale-95
                sm:px-6
              "
            >
              Log In
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              aria-label="Profile"
              title="Profile"
              className="
                ml-1
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                transition
                hover:border-orange-400
              "
            >
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
