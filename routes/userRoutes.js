import express from "express";

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

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// PROTECTED ROUTES
router.post(
  "/logout",
  protect,
  logoutUser
);

// ADMIN ONLY
router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

// ADMIN ONLY
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

// ANY LOGGED-IN USER CAN VIEW A USER
router.get(
  "/:id",
  protect,
  getSingleUser
);

// USER CAN UPDATE SELF, ADMIN CAN UPDATE ANYONE
router.patch(
  "/:id",
  protect,
  updateUser
);

// ADMIN ONLY
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);

export default router;