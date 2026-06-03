import crypto from "crypto";
import Document from "../models/DocumentModel.js";
import { logAction } from "./auditController.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Missing attached file payload",
      });
    }

    const { caseId, category, tag } = req.body;

    // Cryptographic calculation matching digital compliance guidelines
    const hash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    // Cloud storage path indicator
    const computedUrl = `https://cdn.apexlegal.ng/vault/${Date.now()}_${req.file.originalname}`;

    const document = await Document.create({
      case: caseId,
      fileName: req.file.originalname,
      fileUrl: computedUrl,
      uploadedBy: req.user._id,
      category,
      tag,
      fileMetadata: {
        sizeInBytes: req.file.size,
        mimeType: req.file.mimetype,
        evidenceChecksum: hash,
      },
    });

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "UPLOAD_DOCUMENT",
      "Document",
      document._id,
      req.ip,
      {
        fileName: document.fileName,
        category: document.category,
      },
      "success"
    );

    res.status(201).json({
      message: "🛡️ Document ingested and hashed for verification.",
      record: document,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getDocumentsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Querying directly by the raw string ID to prevent Mongoose schema population crashes
    const documents = await Document.find({
      case: caseId,
    });

    if (!documents || documents.length === 0) {
      return res.status(404).json({
        message: "No document logs found matching this Case ID reference.",
      });
    }

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "VIEW_DOCUMENT",
      "Document",
      caseId,
      req.ip,
      {
        totalDocuments: documents.length,
      },
      "success"
    );

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL DOCUMENTS
export const getAllDocumentsRaw = async (req, res) => {
  try {
    const documents = await Document.find({});

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "VIEW_DOCUMENT",
      "Document",
      null,
      req.ip,
      {
        totalDocuments: documents.length,
      },
      "success"
    );

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};