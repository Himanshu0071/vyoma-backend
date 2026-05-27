import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: String,
    phone: String,
    email: String,

    country: String,
    state: String,
    city: String,
    pincode: String,

    address: String,
    landmark: String,

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Address =
  mongoose.models.Address ||
  mongoose.model("Address", addressSchema);

export default Address;