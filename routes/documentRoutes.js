import express from "express";
import multer from "multer";
import { uploadDocument, getDocumentsByCase, getAllDocumentsRaw } from "../controllers/documentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // Capped at 25MB to prevent buffer allocation overloads
});

router.get("/all-raw", getAllDocumentsRaw);
router.post("/upload", protect, upload.single("evidence"), uploadDocument);
router.get("/case/:caseId", protect, getDocumentsByCase);

export default router;