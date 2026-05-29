import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  createProduct,
  getProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.post(
  "/",
  upload.any(),
  createProduct
);

export default router;