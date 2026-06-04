import express from "express";

import {
  createReminder,
  getReminders,
  getReminderById,
  deleteReminder,
} from "../controllers/reminderController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("secretary", "lawyer"),
  createReminder
);

router.get(
  "/",
  protect,
  getReminders
);

router.get(
  "/:id",
  protect,
  getReminderById
);

router.delete(
  "/:id",
  protect,
  authorize("secretary", "lawyer"),
  deleteReminder
);

export default router;