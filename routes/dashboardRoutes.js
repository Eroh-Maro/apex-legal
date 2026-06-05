import express from "express";

import {
  getDashboardStats,
  getUpcomingHearings,
  getRecentCases,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);

router.get(
  "/upcoming-hearings",
  protect,
  getUpcomingHearings
);

router.get(
  "/recent-cases",
  protect,
  getRecentCases
);

export default router;