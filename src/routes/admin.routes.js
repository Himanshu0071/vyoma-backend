import express from "express";

import {
  getDashboardStats,
} from "../controllers/admin.controller.js";

const router =
  express.Router();

/* =========================
   DASHBOARD STATS
========================= */

router.get(
  "/stats",
  getDashboardStats
);

export default router;