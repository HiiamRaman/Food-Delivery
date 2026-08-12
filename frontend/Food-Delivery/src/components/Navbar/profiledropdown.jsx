import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";

function ProfileDropdown({ onLogout, onClose }) {
  const navigate = useNavigate();

  const handleOrders = () => {
    navigate("/myorders");
    onClose();
  };

  return (
    <div
      className="
        absolute right-0 top-full z-50 mt-4
        w-[220px]
        overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        shadow-[0_24px_70px_rgba(15,23,42,0.16)]
      "
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Welcome back 👋
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-3">
        {/* Orders */}
        <button
          type="button"
          onClick={handleOrders}
          className="
            group flex w-full items-center justify-between
            rounded-2xl px-3 py-4
            transition-colors duration-200
            hover:bg-orange-50
          "
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <img
                src={assets.bag_icon}
                alt=""
                className="h-5 w-5"
              />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">
                My Orders
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Track and view your orders
              </p>
            </div>
          </div>

          <span className="text-xl text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-500">
            →
          </span>
        </button>

        {/* Divider */}
        <div className="my-2 border-t border-slate-100" />

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="
            group flex w-full items-center justify-between
            rounded-2xl px-3 py-4
            transition-colors duration-200
            hover:bg-red-50
          "
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
              <img
                src={assets.logout_icon}
                alt=""
                className="h-5 w-5"
              />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-red-500">
                Logout
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Sign out of your account
              </p>
            </div>
          </div>

          <span className="text-xl text-red-200 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-400">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
