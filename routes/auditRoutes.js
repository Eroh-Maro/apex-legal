import express from "express";

import {
  getAuditLogs,
  getLoginActivity,
  getResourceHistory,
} from "../controllers/auditController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply to all audit routes
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAuditLogs);

router.get("/login-activity", getLoginActivity);

router.get("/resource/:resourceId", getResourceHistory);

export default router;