import express from "express";
import multer from "multer";

import {
  registerUser,
  loginUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  deactivateUser,
  reactivateUser,
  logoutUser,
} from "../controllers/userController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// MULTER CONFIGURATION
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB profile picture limit
  },
});

// ==========================
// PUBLIC ROUTES
// ==========================

router.post(
  "/register",
  upload.single("profilePicture"),
  registerUser
);

router.post("/login", loginUser);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

// ==========================
// PROTECTED ROUTES
// ==========================

router.post(
  "/logout",
  protect,
  logoutUser
);

// ==========================
// ADMIN ONLY ROUTES
// ==========================

router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

router.patch(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateUser
);

router.patch(
  "/:id/reactivate",
  protect,
  authorize("admin"),
  reactivateUser
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);

// ==========================
// AUTHENTICATED USER ROUTES
// ==========================

router.get(
  "/:id",
  protect,
  getSingleUser
);

router.patch(
  "/:id",
  protect,
  updateUser
);

export default router;