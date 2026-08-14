import { User } from "../models/user.model.js";
import { Food } from "../models/food.model.js";
import { Order } from "../models/order.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // =========================================
    // BASIC COUNTS
    // =========================================

    const totalUsers = await User.countDocuments();

    const totalFoods = await Food.countDocuments();

    const totalOrders = await Order.countDocuments();


    // =========================================
    // TOTAL REVENUE
    // =========================================

    const revenueResult = await Order.aggregate([
      {
        $match: {
          "payment.status": "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;


    // =========================================
    // ORDER STATUS
    // =========================================

    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);


    // =========================================
    // RECENT ORDERS
    // =========================================

    const recentOrders = await Order.find()
      .populate("user", "username fullname email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();


    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,

      data: {
        totalUsers,
        totalFoods,
        totalOrders,
        totalRevenue,

        orderStatus,

        recentOrders,
      },
    });

  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard statistics",
    });
  }
};
