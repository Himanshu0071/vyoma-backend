import Product from "../models/product.model.js";
import NotifyRequest from "../models/notifyRequest.model.js";

/* =========================
   CREATE NOTIFY REQUEST
========================= */

export const createNotifyRequest = async (req, res) => {
  try {
    const {
      productId,
      size,
      color,
      name,
      email,
      phone,
    } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    if (!size) {
      return res.status(400).json({
        message: "size is required",
      });
    }

    if (!color) {
      return res.status(400).json({
        message: "color is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const user = req.user || null;

    const finalName = user?.name || name;
    const finalEmail = user?.email || email;
    const finalPhone = user?.phone || phone;

    if (!finalName || !finalEmail || !finalPhone) {
      return res.status(400).json({
        message: "name, email and phone are required",
      });
    }

    const dedupeQuery = {
      productId,
      variantSize: String(size),
      variantColor: String(color),
      ...(user?._id
        ? { userId: user._id }
        : {
            userId: null,
            email: String(finalEmail).toLowerCase(),
            phone: String(finalPhone),
          }),
    };

    const exists = await NotifyRequest.findOne(dedupeQuery);
    if (exists) {
      return res.status(409).json({
        success: false,
        message:
          "You have already requested notification for this item.",
      });
    }

    const request = await NotifyRequest.create({
      productId: product._id,
      productTitle: product.title,
      variantColor: String(color),
      variantSize: String(size),
      userId: user?._id || null,
      name: String(finalName),
      email: String(finalEmail).toLowerCase(),
      phone: String(finalPhone),
      notified: false,
    });

    return res.status(201).json({
      success: true,
      message: "Notification request created",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

