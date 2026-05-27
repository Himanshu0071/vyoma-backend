import Order from "../models/order.model.js";
import Address from "../models/address.model.js";

/* =========================
   CREATE ORDER
========================= */

export const createOrder = async (
  req,
  res
) => {
  try {
    const {
      orderItems,
      totalPrice,
      paymentMethod,
      addressId,
      shippingAddress,
    } = req.body;

    let finalAddress = null;

    // If saved address selected
    if (addressId) {
      const savedAddress =
        await Address.findById(
          addressId
        );

      if (!savedAddress) {
        return res
          .status(404)
          .json({
            message:
              "Address not found",
          });
      }

      finalAddress = {
        fullName:
          savedAddress.fullName,

        phone:
          savedAddress.phone,

        email:
          savedAddress.email,

        country:
          savedAddress.country,

        state:
          savedAddress.state,

        city:
          savedAddress.city,

        pincode:
          savedAddress.pincode,

        address:
          savedAddress.address,

        landmark:
          savedAddress.landmark,
      };
    }

    // Manual address from checkout form
    else if (shippingAddress) {
      finalAddress =
        shippingAddress;
    }

    // No address
    else {
      return res
        .status(400)
        .json({
          message:
            "Shipping address required",
        });
    }

    const order =
      await Order.create({
        user: req.user._id,

        orderItems,

        totalPrice,

        paymentMethod,

        shippingAddress:
          finalAddress,

        isPaid: false,

        isDelivered: false,
      });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   GET MY ORDERS
========================= */

export const getMyOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          user: req.user._id,
        }).sort({
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
   GET SINGLE ORDER
========================= */

export const getOrderById =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "user",
          "name email"
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      res.status(200).json(
        order
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
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
   MARK ORDER PAID
========================= */

export const markOrderPaid =
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

      order.isPaid = true;

      order.paidAt =
        Date.now();

      await order.save();

      res.status(200).json({
        message:
          "Order marked as paid",
      });
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