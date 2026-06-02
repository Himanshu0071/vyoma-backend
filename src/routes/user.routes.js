import express from "express";

import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUserRole,
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

router.put(
  "/:id/role",
  updateUserRole
);

export default router;