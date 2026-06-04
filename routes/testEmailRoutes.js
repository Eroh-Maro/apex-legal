import express from "express";
import { sendTestEmail } from "../controllers/testEmailController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendTestEmail);

export default router;