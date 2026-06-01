import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import addressRoutes from "./routes/address.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

connectDB();

const app = express();

/* Middleware */
app.use(express.json());

/* =========================
   CORS
========================= */

const allowedOrigins =
  process.env.CLIENT_URL
    ?.split(",")
    .map((url) => url.trim()) || [];

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      if (
        !origin ||
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },

    credentials: true,
  })
);

/* Routes */
app.get("/", (req, res) => {
  res.send(
    "Vyoma API Running..."
  );
});

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/address",
  addressRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

/* Server */
const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});