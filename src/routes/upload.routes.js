import express from "express";
import streamifier from "streamifier";

import upload from "../middleware/upload.middleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const result = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "vyoma-products",
              },
              (
                error,
                result
              ) => {
                if (error)
                  reject(error);
                else
                  resolve(result);
              }
            );

          streamifier.createReadStream(
            req.file.buffer
          ).pipe(stream);
        }
      );

      res.status(200).json({
        imageUrl:
          result.secure_url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Upload failed",
      });
    }
  }
);

export default router;