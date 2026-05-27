import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createOrder,

  getMyOrders,

  getAllOrders,

  markOrderDelivered,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);
router.get(
  "/",
  getAllOrders
);

router.put(
  "/:id/deliver",
  markOrderDelivered
);

export default router;