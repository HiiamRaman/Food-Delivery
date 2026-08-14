import React, { useEffect, useState } from "react";
import adminApi from "../../Api/axios.admin";
import { toast } from "react-toastify";
import "./Alluser.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================================
  // FETCH USERS
  // =========================================

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await adminApi.get("/user/all");

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("❌ Fetch users error:", error);

      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH ON PAGE LOAD
  // =========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================================
  // UI
  // =========================================

  return (
    <div className="users-page">
      {/* HEADER */}

      <div className="users-header">
        <div>
          <h2>👥 Users</h2>

          <p>Manage registered users</p>
        </div>

        <div className="users-count">{users.length} Users</div>
      </div>

      {/* CONTENT */}

      <div className="users-table-container">
        {loading ? (
          <div className="users-loading">
            <div className="users-spinner"></div>

            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="users-empty">
            <div className="empty-user-icon">👥</div>

            <h3>No users found</h3>

            <p>Registered users will appear here.</p>
          </div>
        ) : (
          <div className="users-table">
            {/* TABLE HEADER */}

            <div className="users-table-header">
              <span>User</span>

              <span>Email</span>

              <span>Role</span>

              <span>Status</span>

              <span>Verified</span>
            </div>

            {/* USERS */}

            {users.map((user) => (
              <div key={user._id} className="user-row">
                {/* USER */}

                <div className="user-profile">
                  <div className="user-avatar">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="user-name">{user.username}</p>

                    <p className="user-fullname">{user.fullname}</p>
                  </div>
                </div>

                {/* EMAIL */}

                <div className="user-email">{user.email}</div>

                {/* ROLE */}

                <div>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>

                {/* STATUS */}

                <div>
                  <span
                    className={
                      user.isActive ? "status-active" : "status-inactive"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* VERIFIED */}

                <div>
                  <span
                    className={
                      user.isVerified ? "verified-badge" : "not-verified-badge"
                    }
                  >
                    {user.isVerified ? "✓ Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
