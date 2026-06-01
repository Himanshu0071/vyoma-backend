import mongoose from "mongoose";

/* =========================
   VARIANT SCHEMA
========================= */

const couponSchema =
  new mongoose.Schema(
    {
      code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      title: {
        type: String,
        default: "",
        trim: true,
      },

      discountType: {
        type: String,
        enum: ["percentage", "flat"],
        default: "percentage",
      },

      discountValue: {
        type: Number,
        required: true,
        min: 0,
      },

      maxDiscount: {
        type: Number,
        default: 0,
      },

      minOrderValue: {
        type: Number,
        default: 0,
      },

      description: {
        type: String,
        default: "",
      },

      termsAndConditions: {
        type: String,
        default: "",
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: false,
    }
  );

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

      mrp: {
        type: Number,
        default: 0,
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
      isActive: {
  type: Boolean,
  default: true,
},

      /* =========================
         COLOR VARIANTS
      ========================= */

      variants: [
        variantSchema,
      ],

      coupons: [
        couponSchema,
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