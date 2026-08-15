import React from "react";
import { ChevronRight, LogOut, Package, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileDropdown({ onLogout, onClose }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleNavigate = (path) => {
    onClose?.();
    navigate(path);
  };

  return (
    <div
      className="
        absolute right-0 top-full z-50 mt-3
        w-[260px]
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-[0_20px_60px_rgba(15,23,42,0.16)]
      "
    >
      {/* ================= PROFILE HEADER ================= */}

      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-orange-100
              text-orange-500
            "
          >
            <User size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {user.fullname || user.username || "Welcome back"}
            </h3>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {user.email || "Your account"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}

      <div className="p-2">
        <button
          type="button"
          onClick={() => handleNavigate("/profile")}
          className="
            group flex w-full items-center justify-between
            rounded-xl px-3 py-3
            text-left
            transition
            hover:bg-slate-50
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-slate-100
                text-slate-600
                transition
                group-hover:bg-orange-100
                group-hover:text-orange-500
              "
            >
              <User size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">My Profile</p>

              <p className="text-xs text-slate-400">Manage account details</p>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
          />
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/my-orders")}
          className="
            group flex w-full items-center justify-between
            rounded-xl px-3 py-3
            text-left
            transition
            hover:bg-slate-50
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-slate-100
                text-slate-600
                transition
                group-hover:bg-orange-100
                group-hover:text-orange-500
              "
            >
              <Package size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">My Orders</p>

              <p className="text-xs text-slate-400">View previous orders</p>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
          />
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/change-password")}
          className="
            group flex w-full items-center justify-between
            rounded-xl px-3 py-3
            text-left
            transition
            hover:bg-slate-50
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-slate-100
                text-slate-600
                transition
                group-hover:bg-orange-100
                group-hover:text-orange-500
              "
            >
              <Settings size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">Security</p>

              <p className="text-xs text-slate-400">Change your password</p>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
          />
        </button>
      </div>

      {/* ================= LOGOUT ================= */}

      <div className="border-t border-slate-100 p-2">
        <button
          type="button"
          onClick={onLogout}
          className="
            group flex w-full items-center justify-between
            rounded-xl px-3 py-3
            transition
            hover:bg-red-50
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-red-50
                text-red-500
              "
            >
              <LogOut size={17} />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-red-500">Logout</p>

              <p className="text-xs text-red-300">Sign out of your account</p>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="text-red-200 transition group-hover:translate-x-0.5 group-hover:text-red-400"
          />
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
