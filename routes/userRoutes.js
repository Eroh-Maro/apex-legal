import express from "express";

import {
  registerUser,
  loginUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN ONLY
router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
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