import mongoose from "mongoose";

const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      orderItems: [
        {
          title: String,

          quantity: Number,

          image: String,

          price: Number,

          product: {
            type:
              mongoose.Schema
                .Types
                .ObjectId,

            ref: "Product",
          },
        },
      ],

      totalPrice: {
        type: Number,

        required: true,
      },

      isPaid: {
        type: Boolean,

        default: false,
      },
      isDelivered: {
        type: Boolean,

        default: false,
      },

      deliveredAt: Date,
      paidAt: Date,

      razorpayOrderId:
        String,

      razorpayPaymentId:
        String,
    },
    {
      timestamps: true,
    }
  );

const Order =
  mongoose.model(
    "Order",
    orderSchema
  );

export default Order;