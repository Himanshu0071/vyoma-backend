import User from "../models/user.model.js";

import Product from "../models/product.model.js";

import Order from "../models/order.model.js";

/* =========================
   ADMIN DASHBOARD STATS
========================= */

export const getDashboardStats =
  async (req, res) => {
    try {
      /* COUNTS */
      const totalUsers =
        await User.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      /* REVENUE */
      const orders =
        await Order.find({});

      const totalRevenue =
        orders.reduce(
          (acc, order) =>
            acc +
            order.totalPrice,
          0
        );

      /* RECENT ORDERS */
      const recentOrders =
        await Order.find({})
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);

      res.status(200).json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };