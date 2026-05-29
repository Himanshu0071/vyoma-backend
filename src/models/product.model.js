import mongoose from "mongoose";

/* =========================
   VARIANT SCHEMA
========================= */

const variantSchema =
  new mongoose.Schema(
    {
      color: {
        type: String,
        required: true,
      },

      images: [
        {
          type: String,
        },
      ],

      stock: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: false,
    }
  );

/* =========================
   PRODUCT SCHEMA
========================= */

const productSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
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

      brand: {
        type: String,
        default: "",
      },

      gender: {
        type: String,
        enum: [
          "men",
          "women",
          "unisex",
        ],
        default: "unisex",
      },

      sizes: [
        {
          type: String,
        },
      ],

      discount: {
        type: Number,
        default: 0,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      /* =========================
         COLOR VARIANTS
      ========================= */

      variants: [
        variantSchema,
      ],
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