import React from "react";
import "./Profile.css";

import {
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const firstName =
    user.fullname?.split(" ")[0] ||
    user.username ||
    "User";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menuItems = [
    {
      title: "My Orders",
      description: "Track and review your orders",
      icon: Package,
      path: "/my-orders",
    },
    {
      title: "Saved Addresses",
      description: "Manage delivery locations",
      icon: MapPin,
      path: "/addresses",
    },
    {
      title: "Favorites",
      description: "Meals you saved for later",
      icon: Heart,
      path: "/favorites",
    },
    {
      title: "Security",
      description: "Password and account security",
      icon: ShieldCheck,
      path: "/change-password",
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* ================= HEADER ================= */}

        <div className="profile-page-header">
          <span className="profile-eyebrow">
            MY ACCOUNT
          </span>

          <h1>
            Welcome back,{" "}
            <span>{firstName}</span>
          </h1>

          <p>
            Manage your account, orders and personal preferences.
          </p>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="profile-layout">
          {/* ================= USER CARD ================= */}

          <aside className="profile-card">
            <div className="profile-card-glow" />

            <div className="profile-avatar">
              <User size={34} />
            </div>

            <h2>
              {user.fullname ||
                user.username ||
                "User"}
            </h2>

            <p className="profile-email">
              {user.email ||
                "No email available"}
            </p>

            <span className="profile-status">
              <span />
              Active account
            </span>

            <div className="profile-divider" />

            <div className="profile-details">
              <div>
                <span>Account</span>

                <strong>
                  {user.role || "User"}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong className="verified">
                  Verified
                </strong>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT ================= */}

          <section className="profile-main">
            <div className="profile-section">
              <div className="profile-section-header">
                <div>
                  <h2>Account overview</h2>

                  <p>
                    Everything related to your account in one place.
                  </p>
                </div>
              </div>

              <div className="profile-menu-grid">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      className="profile-menu-item"
                      onClick={() =>
                        navigate(item.path)
                      }
                    >
                      <div className="profile-menu-icon">
                        <Icon size={20} />
                      </div>

                      <div className="profile-menu-content">
                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.description}
                        </span>
                      </div>

                      <ChevronRight
                        className="profile-menu-arrow"
                        size={18}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= LOGOUT ================= */}

            <div className="profile-logout-card">
              <div className="profile-logout-content">
                <div className="profile-logout-icon">
                  <LogOut size={20} />
                </div>

                <div>
                  <h3>Ready to leave?</h3>

                  <p>
                    You can log back into your account anytime.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="profile-logout-button"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
