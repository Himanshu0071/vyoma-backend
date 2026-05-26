import express from "express";

import {
  createProduct,
  getProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.post("/", createProduct);

export default router;