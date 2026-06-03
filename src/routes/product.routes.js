import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  globalSearch,
  restoreProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/search", globalSearch);

router.get("/", getProducts);

router.get(
  "/:id",
  getSingleProduct
);

router.post(
  "/",
  upload.any(),
  createProduct
);

router.put(
  "/:id",
  upload.any(),
  updateProduct
);

router.delete(
  "/:id",
  deleteProduct
);

router.put(
  "/restore/:id",
  restoreProduct
);

export default router;