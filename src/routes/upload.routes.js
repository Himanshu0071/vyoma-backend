import express from "express";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  (req, res) => {
    res.status(200).json({
      imageUrl: req.file.path,
    });
  }
);

export default router;