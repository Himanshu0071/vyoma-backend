import express from "express";

import protect from "../middleware/auth.middleware.js";
import requireAdmin from "../middleware/admin.middleware.js";

import {
  getCountsByProduct,
  getDemandBreakdown,
  getNotifyStats,
  listNotifyRequests,
} from "../controllers/adminNotify.controller.js";

const router = express.Router();

router.get("/", protect, requireAdmin, listNotifyRequests);
router.get("/stats", protect, requireAdmin, getNotifyStats);
router.get("/counts-by-product", protect, requireAdmin, getCountsByProduct);
router.get(
  "/demand/:productId",
  protect,
  requireAdmin,
  getDemandBreakdown
);

export default router;

