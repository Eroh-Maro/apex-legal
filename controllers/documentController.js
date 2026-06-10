import crypto from "crypto";
import Document from "../models/documentModel.js";
import cloudinary from "../config/cloudinary.js";
import { logAction } from "./auditController.js";

const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "apex-legal-documents",
          resource_type: "auto",
          public_id: `${Date.now()}-${originalname}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Missing attached file payload",
      });
    }

    const { caseId, category, tag } = req.body;

    // SHA-256 Integrity Hash
    const hash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    // CLOUDINARY UPLOAD
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const document = await Document.create({
      case: caseId,
      fileName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url,
      uploadedBy: req.user._id,
      category,
      tag,
      fileMetadata: {
        sizeInBytes: req.file.size,
        mimeType: req.file.mimetype,
        evidenceChecksum: hash,
      },
    });

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
      message: "🛡️ Document uploaded, stored, and hashed for verification.",
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

    const documents = await Document.find({
      case: caseId,
    });

    if (!documents || documents.length === 0) {
      return res.status(404).json({
        message: "No document logs found matching this Case ID reference.",
      });
    }

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

export const getAllDocumentsRaw = async (req, res) => {
  try {
    const documents = await Document.find({});

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