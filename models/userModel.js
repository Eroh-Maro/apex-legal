// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: [
        "lawyer",
        "admin",
        "secretary",
        "practice manager",
        "paralegal",
        "unknown",
      ],
      default: "lawyer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    phone: {
      type: String,
    },

    lawFirm: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
