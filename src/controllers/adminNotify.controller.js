import mongoose from "mongoose";

import NotifyRequest from "../models/notifyRequest.model.js";

/* =========================
   ADMIN: LIST REQUESTS
========================= */

export const listNotifyRequests = async (req, res) => {
  try {
    const {
      q,
      productId,
      status,
      from,
      to,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (productId) {
      query.productId = new mongoose.Types.ObjectId(
        String(productId)
      );
    }

    if (status === "pending") {
      query.notified = false;
    } else if (status === "notified") {
      query.notified = true;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(String(from));
      if (to) query.createdAt.$lte = new Date(String(to));
    }

    if (q) {
      const regex = new RegExp(String(q), "i");
      query.$or = [
        { productTitle: regex },
        { variantColor: regex },
        { variantSize: regex },
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Math.max(1, Number(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      NotifyRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      NotifyRequest.countDocuments(query),
    ]);

    return res.status(200).json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   ADMIN: STATS (WIDGET)
========================= */

export const getNotifyStats = async (req, res) => {
  try {
    const pending = await NotifyRequest.countDocuments({
      notified: false,
    });

    const top = await NotifyRequest.aggregate([
      { $match: { notified: false } },
      {
        $group: {
          _id: "$productId",
          productTitle: { $first: "$productTitle" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      pendingRequests: pending,
      topRequestedProducts: top.map((t) => ({
        productId: t._id,
        productTitle: t.productTitle,
        count: t.count,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   ADMIN: COUNTS BY PRODUCT
========================= */

export const getCountsByProduct = async (req, res) => {
  try {
    const rows = await NotifyRequest.aggregate([
      { $match: { notified: false } },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
        },
      },
    ]);

    const map = {};
    rows.forEach((r) => {
      map[String(r._id)] = r.count;
    });

    return res.status(200).json(map);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   ADMIN: DEMAND BREAKDOWN
========================= */

export const getDemandBreakdown = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    const rows = await NotifyRequest.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(String(productId)),
          notified: false,
        },
      },
      {
        $group: {
          _id: {
            size: "$variantSize",
            color: "$variantColor",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json(
      rows.map((r) => ({
        size: r._id.size,
        color: r._id.color,
        count: r.count,
      }))
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

