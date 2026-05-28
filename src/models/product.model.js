import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        required: true,
        lowercase: true,
      },

      images: [
        {
          type: String,
        },
      ],

      /* NEW FIELDS */

      brand: {
        type: String,
        default: "",
      },

      stock: {
        type: Number,
        default: 0,
      },

      sizes: [
        {
          type: String,
        },
      ],

      gender: {
        type: String,
        enum: [
          "men",
          "women",
          "unisex",
        ],

        default:
          "unisex",
      },

      discount: {
        type: Number,
        default: 0,
      },

      featured: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

const Product =
  mongoose.model(
    "Product",
    productSchema
  );

export default Product;