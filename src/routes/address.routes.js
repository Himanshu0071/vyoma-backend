import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

/* =========================
   CREATE ADDRESS
========================= */

router.post(
  "/",
  protect,
  createAddress
);

/* =========================
   GET ALL USER ADDRESSES
========================= */

router.get(
  "/",
  protect,
  getUserAddresses
);

/* =========================
   GET SINGLE ADDRESS
========================= */

router.get(
  "/:id",
  protect,
  getAddressById
);

/* =========================
   UPDATE ADDRESS
========================= */

router.put(
  "/:id",
  protect,
  updateAddress
);

/* =========================
   DELETE ADDRESS
========================= */

router.delete(
  "/:id",
  protect,
  deleteAddress
);

/* =========================
   SET DEFAULT ADDRESS
========================= */

router.put(
  "/default/:id",
  protect,
  setDefaultAddress
);

export default router;