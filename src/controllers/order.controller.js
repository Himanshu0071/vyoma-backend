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