import Address from "../models/address.model.js";

/* =========================
   CREATE ADDRESS
========================= */

export const createAddress =
  async (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        country,
        state,
        city,
        pincode,
        address,
        landmark,
        isDefault,
      } = req.body;

      // Remove previous default address
      if (isDefault) {
        await Address.updateMany(
          {
            user: req.user._id,
          },
          {
            isDefault: false,
          }
        );
      }

      const newAddress =
        await Address.create({
          user: req.user._id,

          fullName,
          phone,
          email,

          country,
          state,
          city,
          pincode,

          address,
          landmark,

          isDefault,
        });

      res.status(201).json({
        success: true,
        address: newAddress,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

/* =========================
   GET USER ADDRESSES
========================= */

export const getUserAddresses =
  async (req, res) => {
    try {
      const addresses =
        await Address.find({
          user: req.user._id,
        }).sort({
          isDefault: -1,
          createdAt: -1,
        });

      res.status(200).json(
        addresses
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

/* =========================
   GET SINGLE ADDRESS
========================= */

export const getAddressById =
  async (req, res) => {
    try {
      const address =
        await Address.findOne({
          _id: req.params.id,
          user: req.user._id,
        });

      if (!address) {
        return res
          .status(404)
          .json({
            message:
              "Address not found",
          });
      }

      res.status(200).json(
        address
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   UPDATE ADDRESS
========================= */

export const updateAddress =
  async (req, res) => {
    try {
      const address =
        await Address.findOne({
          _id: req.params.id,
          user: req.user._id,
        });

      if (!address) {
        return res
          .status(404)
          .json({
            message:
              "Address not found",
          });
      }

      const {
        fullName,
        phone,
        email,
        country,
        state,
        city,
        pincode,
        address: fullAddress,
        landmark,
        isDefault,
      } = req.body;

      // Remove previous default
      if (isDefault) {
        await Address.updateMany(
          {
            user: req.user._id,
          },
          {
            isDefault: false,
          }
        );
      }

      address.fullName =
        fullName ||
        address.fullName;

      address.phone =
        phone || address.phone;

      address.email =
        email || address.email;

      address.country =
        country ||
        address.country;

      address.state =
        state || address.state;

      address.city =
        city || address.city;

      address.pincode =
        pincode ||
        address.pincode;

      address.address =
        fullAddress ||
        address.address;

      address.landmark =
        landmark ||
        address.landmark;

      if (
        typeof isDefault ===
        "boolean"
      ) {
        address.isDefault =
          isDefault;
      }

      const updatedAddress =
        await address.save();

      res.status(200).json({
        success: true,
        address:
          updatedAddress,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   DELETE ADDRESS
========================= */

export const deleteAddress =
  async (req, res) => {
    try {
      const address =
        await Address.findOne({
          _id: req.params.id,
          user: req.user._id,
        });

      if (!address) {
        return res
          .status(404)
          .json({
            message:
              "Address not found",
          });
      }

      await address.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Address deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   SET DEFAULT ADDRESS
========================= */

export const setDefaultAddress =
  async (req, res) => {
    try {
      const address =
        await Address.findOne({
          _id: req.params.id,
          user: req.user._id,
        });

      if (!address) {
        return res
          .status(404)
          .json({
            message:
              "Address not found",
          });
      }

      // Remove old default
      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          isDefault: false,
        }
      );

      address.isDefault = true;

      await address.save();

      res.status(200).json({
        success: true,
        message:
          "Default address updated",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };