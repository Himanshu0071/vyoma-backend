import Order from "../models/order.model.js";

export const createOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.create({
      ...req.body,

      user: req.user._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/* =========================
   GET ALL ORDERS
========================= */

export const getAllOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({})
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        orders
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   MARK DELIVERED
========================= */

export const markOrderDelivered =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      order.isDelivered =
        true;

      order.deliveredAt =
        Date.now();

      await order.save();

      res.status(200).json({
        message:
          "Order delivered",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };