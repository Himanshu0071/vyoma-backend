import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return next();
    }

    const token = header.split(" ")[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await User.findById(
      decoded.id
    ).select("-password");

    return next();
  } catch (e) {
    // Invalid token → treat as guest
    return next();
  }
};

export default optionalAuth;

