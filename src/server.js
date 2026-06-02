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
import notifyRoutes from "./routes/notify.routes.js";
import adminNotifyRoutes from "./routes/adminNotify.routes.js";

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

// app.use(
//   cors({
//     origin: (
//       origin,
//       callback
//     ) => {
//       if (
//         !origin ||
//         allowedOrigins.includes(
//           origin
//         )
//       ) {
//         return callback(
//           null,
//           true
//         );
//       }

//       callback(
//         new Error(
//           "Not allowed by CORS"
//         )
//       );
//     },

//     credentials: true,
//   })
// );

app.use(cors());

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

app.use("/api/notify", notifyRoutes);

app.use("/api/admin/notify-requests", adminNotifyRoutes);

/* Server */
const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});