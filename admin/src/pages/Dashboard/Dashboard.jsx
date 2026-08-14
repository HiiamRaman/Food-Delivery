import React, { useEffect, useState } from "react";
import {
  Users,
  Utensils,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

import adminApi from "../../Api/axios.admin";
import { toast } from "react-toastify";
import "./Dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await adminApi.get("/dashboard");

      if (response.data.success) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-error">
        <p>Unable to load dashboard.</p>

        <button onClick={fetchDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  const getStatusCount = (status) => {
    const result = dashboard.orderStatus?.find(
      (item) => item._id === status
    );

    return result?.count || 0;
  };

  return (
    <div className="dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, Admin 👋
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchDashboard}
        >
          Refresh
        </button>

      </div>


      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="stats-grid">

        {/* Users */}

        <div className="stat-card">

          <div className="stat-icon users">
            <Users size={24} />
          </div>

          <div>
            <p>Total Users</p>
            <h2>{dashboard.totalUsers}</h2>
          </div>

        </div>


        {/* Foods */}

        <div className="stat-card">

          <div className="stat-icon foods">
            <Utensils size={24} />
          </div>

          <div>
            <p>Total Foods</p>
            <h2>{dashboard.totalFoods}</h2>
          </div>

        </div>


        {/* Orders */}

        <div className="stat-card">

          <div className="stat-icon orders">
            <ShoppingBag size={24} />
          </div>

          <div>
            <p>Total Orders</p>
            <h2>{dashboard.totalOrders}</h2>
          </div>

        </div>


        {/* Revenue */}

        <div className="stat-card">

          <div className="stat-icon revenue">
            <DollarSign size={24} />
          </div>

          <div>
            <p>Total Revenue</p>

            <h2>
              Rs. {dashboard.totalRevenue}
            </h2>
          </div>

        </div>

      </div>


      {/* =========================
          ORDER STATUS
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Order Overview</h2>

            <p>
              Current order status
            </p>
          </div>

        </div>


        <div className="order-status-grid">

          <div className="status-card">

            <Clock />

            <div>
              <span>Placed</span>
              <strong>
                {getStatusCount("placed")}
              </strong>
            </div>

          </div>


          <div className="status-card">

            <CheckCircle />

            <div>
              <span>Confirmed</span>
              <strong>
                {getStatusCount("confirmed")}
              </strong>
            </div>

          </div>


          <div className="status-card">

            <Utensils />

            <div>
              <span>Preparing</span>
              <strong>
                {getStatusCount("preparing")}
              </strong>
            </div>

          </div>


          <div className="status-card">

            <Truck />

            <div>
              <span>Out for Delivery</span>

              <strong>
                {getStatusCount(
                  "out_for_delivery"
                )}
              </strong>
            </div>

          </div>


          <div className="status-card">

            <CheckCircle />

            <div>
              <span>Delivered</span>

              <strong>
                {getStatusCount("delivered")}
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          RECENT ORDERS
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Recent Orders</h2>

            <p>
              Latest orders from customers
            </p>
          </div>

        </div>


        <div className="recent-orders">

          {dashboard.recentOrders?.length === 0 ? (

            <div className="empty-orders">
              No orders found
            </div>

          ) : (

            dashboard.recentOrders.map(
              (order) => (

                <div
                  className="recent-order"
                  key={order._id}
                >

                  <div className="order-customer">

                    <div className="customer-avatar">
                      {order.user?.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {order.user?.username ||
                          "Unknown User"}
                      </h3>

                      <p>
                        {order.user?.email ||
                          "No email"}
                      </p>

                    </div>

                  </div>


                  <div className="order-details">

                    <span>
                      Order #
                      {order._id.slice(-6)}
                    </span>

                    <strong>
                      Rs.{" "}
                      {order.pricing?.totalAmount ||
                        0}
                    </strong>

                  </div>


                  <span
                    className={`dashboard-status status-${order.orderStatus}`}
                  >
                    {order.orderStatus
                      ?.replaceAll("_", " ")}
                  </span>

                </div>

              )
            )

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
