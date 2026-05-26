import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: String,

        title: String,

        image: String,

        price: Number,

        quantity: Number,
      },
    ],

    shippingAddress: {
      fullName: String,

      phone: String,

      address: String,

      city: String,

      postalCode: String,

      country: String,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    orderStatus: {
      type: String,
      default: "Processing",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;