import express from "express";

import {
  getAuditLogs,
  getLoginActivity,
  getResourceHistory,
} from "../controllers/auditController.js";

const router = express.Router();

router.get("/", getAuditLogs);

router.get("/login-activity", getLoginActivity);

router.get("/resource/:resourceId", getResourceHistory);

export default router;
