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
      
      shippingAddress: {
  fullName: String,
  phone: String,
  email: String,

  country: String,
  state: String,
  city: String,
  pincode: String,

  address: String,
  landmark: String,
},

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