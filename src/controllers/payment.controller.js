import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/order.model.js";
import sendOrderEmail from "../utils/sendOrderEmail.js";

/* =========================
   CREATE PAYMENT ORDER
========================= */

export const createPaymentOrder =
  async (req, res) => {
    try {
      const {
        amount,
      } = req.body;

      const options = {
        amount:
          amount * 100,

        currency: "INR",

        receipt:
          "receipt_order_" +
          Date.now(),
      };

      const order =
        await razorpay.orders.create(
          options
        );

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
   VERIFY PAYMENT
========================= */

export const verifyPayment =
  async (req, res) => {
    try {
      const {
        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        orderItems,

        totalPrice,

        userId,
      } = req.body;

      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(body)
          .digest("hex");

      const isAuthentic =
        expectedSignature ===
        razorpay_signature;

      if (!isAuthentic) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid signature",
          });
      }

      /* SAVE ORDER */

      const order =
        await Order.create({
          user: userId,

          orderItems,

          totalPrice,

          isPaid: true,

          paidAt: Date.now(),

          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,
        });

        await sendOrderEmail({
  email: req.body.email,

  name: req.body.name,

  orderId: order._id,

  totalPrice,
});

      res.status(200).json({
        success: true,

        order,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };