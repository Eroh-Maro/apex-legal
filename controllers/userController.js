// controllers/userController.js

import User from "../models/userModel.js";
import { logAction } from "./auditController.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
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

// SEND WELCOME EMAIL
try {
  await sendEmail(
    user.email,
    "Welcome to Apex Legal",
    `
    <h2>Welcome to Apex Legal</h2>

    <p>Hello ${user.fullName},</p>

    <p>Your account has been successfully created.</p>

    <p><strong>Role:</strong> ${user.role}</p>

    <p>You can now log in and begin using the Apex Legal platform.</p>

    <p>Please keep your credentials secure and contact an administrator if you experience any access issues.</p>

    <br>

    <p>Regards,</p>
    <p><strong>Apex Legal Team</strong></p>
    `
  );
} catch (emailError) {
  console.error(
    "Welcome email failed:",
    emailError.message
  );
}

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

    // CHECK IF ACCOUNT IS DEACTIVATED
    if (user.isActive === false) {

      await logAction(
        user._id,
        user.email,
        user.role,
        "LOGIN_FAILED",
        "Auth",
        user._id,
        req.ip,
        {
          reason: "Account deactivated",
        },
        "failed"
      );

      return res.status(403).json({
        message: "Account has been deactivated",
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

    // OWNER OR ADMIN
const isOwner = req.user.id === id;
const isAdmin = req.user.role === "admin";

if (!isOwner && !isAdmin) {
  return res.status(403).json({
    message: "Not authorized to update this user",
  });
}
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `
      <h2>Password Reset Request</h2>

      <p>Hello ${user.fullName},</p>

      <p>Click the link below to reset your password:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
      `
    );

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "DEACTIVATE_USER",
      "User",
      user._id,
      req.ip,
      {
        deactivatedUserEmail: user.email,
      },
      "success"
    );

    res.status(200).json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "REACTIVATE_USER",
      "User",
      user._id,
      req.ip,
      {
        reactivatedUserEmail: user.email,
      },
      "success"
    );

    res.status(200).json({
      message: "User reactivated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "LOGOUT",
      "Auth",
      req.user._id,
      req.ip,
      {},
      "success"
    );

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};