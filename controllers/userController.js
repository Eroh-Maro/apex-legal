// controllers/userController.js

import User from "../models/userModel.js";
import { logAction } from "./auditController.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    // AUDIT LOG
    await logAction(
      user._id,
      user.email,
      user.role,
      "CREATE_USER",
      "User",
      user._id,
      req.ip,
      {
        fullName: user.fullName,
      },
      "success"
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {

      // AUDIT FAILED LOGIN
      await logAction(
        "unknown",
        email,
        "unknown",
        "LOGIN_FAILED",
        "Auth",
        null,
        req.ip,
        {
          reason: "User not found",
        },
        "failed"
      );

      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      // AUDIT FAILED LOGIN
      await logAction(
        user._id,
        user.email,
        user.role,
        "LOGIN_FAILED",
        "Auth",
        user._id,
        req.ip,
        {
          reason: "Invalid password",
        },
        "failed"
      );

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // AUDIT SUCCESS LOGIN
    await logAction(
      user._id,
      user.email,
      user.role,
      "LOGIN_SUCCESS",
      "Auth",
      user._id,
      req.ip,
      {},
      "success"
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE USER
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };

    // HASH PASSWORD IF USER UPDATES PASSWORD
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "UPDATE_USER",
      "User",
      updatedUser._id,
      req.ip,
      {
        updatedFields: Object.keys(req.body),
      },
      "success"
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findById(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "DELETE_USER",
      "User",
      deletedUser._id,
      req.ip,
      {
        deletedUserEmail: deletedUser.email,
        deletedUserRole: deletedUser.role,
      },
      "success"
    );

    await deletedUser.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};