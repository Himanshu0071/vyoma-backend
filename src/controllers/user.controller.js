import User from "../models/user.model.js";

/* =========================
   GET ALL USERS
========================= */

export const getAllUsers =
  async (req, res) => {
    try {
      const users =
        await User.find({})
          .select("-password")
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        users
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   CREATE USER / ADMIN
========================= */

export const createUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
      } = req.body;

      /* CHECK EXISTING */
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      /* CREATE USER */
      const user =
        await User.create({
          name,
          email,
          password,
          role:
            role || "user",
        });

      res.status(201).json({
        message:
          "User created successfully",

        user: {
          _id: user._id,
          name: user.name,
          email:
            user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   DELETE USER
========================= */

export const deleteUser =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      await user.deleteOne();

      res.status(200).json({
        message:
          "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   UPDATE USER ROLE
========================= */

export const updateUserRole =
  async (req, res) => {
    try {
      const { role } = req.body;

      if (
        !role ||
        !["user", "admin"].includes(role)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid role",
          });
      }

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          { role },
          { new: true }
        ).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      res.status(200).json({
        message:
          "Access updated",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };