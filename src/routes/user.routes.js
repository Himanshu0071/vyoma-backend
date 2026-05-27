import express from "express";

import {
  getAllUsers,
  createUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router =
  express.Router();

/* =========================
   ROUTES
========================= */

router.get(
  "/",
  getAllUsers
);

router.post(
  "/",
  createUser
);

router.delete(
  "/:id",
  deleteUser
);

export default router;