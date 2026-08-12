import React from "react";
import { assets } from "../../assets/assets.js";

function ProfileDropdown({ onLogout }) {
  return (
    <div
      className="
        absolute left-0 top-full z-50 mt-3
        w-[220px]
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-[0_20px_60px_rgba(15,23,42,0.14)]
      "
    >
      {/* Profile Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="h-5 w-5 rounded-full"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Welcome back 👋
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Your account
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-2">
        <button
          type="button"
          onClick={onLogout}
          className="
            group flex w-full items-center justify-between
            rounded-xl px-3 py-3
            transition-all duration-200
            hover:bg-red-50
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
              <img
                src={assets.logout_icon}
                alt=""
                className="h-5 w-5"
              />
            </div>

            <span className="text-sm font-semibold text-red-500">
              Logout
            </span>
          </div>

          <span className="text-base text-red-200 transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-400">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
