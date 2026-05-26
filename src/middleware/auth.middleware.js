import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const protect = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET
    );

    req.user = await User.findById(
      decoded.id
    ).select("-password");

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized",
    });
  }
};

export default protect;