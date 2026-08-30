import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Heart } from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import "./Navbar.css";

import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    getCartTotal,
    token,
    setToken,
  } = useContext(StoreContext);

  // Only used for homepage sections:
  // Menu, Get App, Contact
  const [activeSection, setActiveSection] =
    useState(null);

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isSearchOpen, setIsSearchOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const searchInputRef = useRef(null);

  // =====================================
  // SCROLL EFFECT
  // =====================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // =====================================
  // SEARCH AUTO FOCUS
  // =====================================

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // =====================================
  // RESET ACTIVE SECTION
  // WHEN LEAVING HOME
  // =====================================

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
    }
  }, [location.pathname]);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem("user");

    setToken(null);

    toast.success(
      "Logged out successfully"
    );

    navigate("/");
  };

  // =====================================
  // HOME
  // =====================================

  const handleHomeClick = () => {
    setActiveSection(null);

    setIsSearchOpen(false);
    setSearchValue("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // HOME SECTION NAVIGATION
  // =====================================

  const handleSectionClick = (
    event,
    item
  ) => {
    event.preventDefault();

    const scrollToSection = () => {
      const section =
        document.querySelector(
          item.path
        );

      if (!section) return;

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setActiveSection(item.id);
    };

    // Already on homepage
    if (location.pathname === "/") {
      scrollToSection();

      return;
    }

    // Coming from food details,
    // cart, profile, favorites, etc.
    navigate("/");

    setTimeout(() => {
      scrollToSection();
    }, 150);
  };

  // =====================================
  // SEARCH
  // =====================================

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchValue("");

    navigate("/");
  };

  const handleSearchChange = (event) => {
    const value =
      event.target.value;

    setSearchValue(value);

    if (!value.trim()) {
      return;
    }

    navigate(
      `/food-display?search=${encodeURIComponent(
        value
      )}`
    );
  };

  // =====================================
  // NAV ITEMS
  // =====================================

  const navItems = [
    {
      id: "Menu",
      label: "Menu",
      path: "#explore-menu",
    },

    {
      id: "MobileApp",
      label: "Get App",
      path: "#app-download",
    },

    {
      id: "Contact",
      label: "Contact",
      path: "#footer",
    },
  ];

  // =====================================
  // HOME ACTIVE
  // =====================================

  const isHomePage =
    location.pathname === "/";

  /*
    Home is active ONLY when:

    1. pathname is "/"
    2. no homepage section is active
  */

  const isHomeActive =
    isHomePage &&
    activeSection === null;

  return (
    <header
      className={`navbar ${
        isScrolled
          ? "navbar-scrolled"
          : ""
      }`}
    >
      <div className="navbar-container">
        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          to="/"
          onClick={handleHomeClick}
          className="navbar-logo"
        >
          Raman
          <span>.</span>
        </Link>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="navbar-navigation">
          <ul>
            {/* HOME */}

            <li>
              <Link
                to="/"
                onClick={handleHomeClick}
                className={`nav-link ${
                  isHomeActive
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Home
              </Link>
            </li>

            {/* HOMEPAGE SECTIONS */}

            {navItems.map((item) => {
              const isActive =
                isHomePage &&
                activeSection ===
                  item.id;

              return (
                <li key={item.id}>
                  <a
                    href={item.path}
                    onClick={(event) =>
                      handleSectionClick(
                        event,
                        item
                      )
                    }
                    className={`nav-link ${
                      isActive
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="navbar-actions">
          {/* =====================================
              SEARCH
          ===================================== */}

          {isSearchOpen ? (
            <div className="navbar-search-open">
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                placeholder="Search food..."
                onChange={
                  handleSearchChange
                }
                className="navbar-search-input"
              />

              <button
                type="button"
                onClick={
                  handleSearchClose
                }
                aria-label="Close search"
                className="navbar-close-search"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Search"
              onClick={
                handleSearchOpen
              }
              className="navbar-icon-button"
            >
              <img
                src={
                  assets.search_icon
                }
                alt="Search"
              />
            </button>
          )}

          {/* =====================================
              FAVORITES
          ===================================== */}

          {token && (
            <Link
              to="/favorites"
              aria-label="Favorites"
              title="Favorites"
              className="navbar-icon-button favorite-navbar-button"
            >
              <Heart
                size={20}
                strokeWidth={2}
              />
            </Link>
          )}

          {/* =====================================
              CART
          ===================================== */}

          <Link
            to="/cart"
            aria-label="Cart"
            title="Cart"
            className="navbar-icon-button cart-navbar-button"
          >
            <img
              src={
                assets.basket_icon
              }
              alt="Cart"
            />

            {getCartTotal() > 0 && (
              <span className="cart-dot" />
            )}
          </Link>

          {/* =====================================
              LOGIN / PROFILE
          ===================================== */}

          {!token ? (
            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="navbar-login-button"
            >
              Log In
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              aria-label="Profile"
              title="Profile"
              className="navbar-profile-button"
            >
              <img
                src={
                  assets.profile_icon
                }
                alt="Profile"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
