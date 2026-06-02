import mongoose from "mongoose";

const notifyRequestSchema =
  new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
      },

      productTitle: {
        type: String,
        default: "",
        trim: true,
      },

      variantColor: {
        type: String,
        default: "",
        trim: true,
        index: true,
      },

      variantSize: {
        type: String,
        default: "",
        trim: true,
        index: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      notified: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

notifyRequestSchema.index(
  {
    productId: 1,
    variantColor: 1,
    variantSize: 1,
    userId: 1,
    email: 1,
    phone: 1,
  },
  { name: "notify_request_dedupe" }
);

const NotifyRequest = mongoose.model(
  "NotifyRequest",
  notifyRequestSchema
);

export default NotifyRequest;

