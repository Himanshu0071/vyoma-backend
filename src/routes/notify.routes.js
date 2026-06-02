import express from "express";

import optionalAuth from "../middleware/optionalAuth.middleware.js";

import { createNotifyRequest } from "../controllers/notify.controller.js";

const router = express.Router();

router.post("/", optionalAuth, createNotifyRequest);

export default router;

