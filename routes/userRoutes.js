import express from "express";

import {
  registerUser,
  loginUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", getUsers);

router.get("/:id", getSingleUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser)

export default router;