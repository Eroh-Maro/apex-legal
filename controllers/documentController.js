import crypto from "crypto";
import Document from "../models/DocumentModel.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing attached file payload" });
    const { caseId, category, tag } = req.body;

    // Cryptographic calculation matching digital compliance guidelines
    const hash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
    
    // Cloud storage path indicator - swap this out with your final Cloudinary or AWS S3 integration script
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

    res.status(201).json({ message: "🛡️ Document ingested and hashed for verification.", record: document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocumentsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Querying directly by the raw string ID to prevent Mongoose schema population crashes
    const documents = await Document.find({ case: caseId });

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "No document logs found matching this Case ID reference." });
    }

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this at the bottom of src/controllers/documentController.js
export const getAllDocumentsRaw = async (req, res) => {
  try {
    // We remove .populate() entirely so it won't crash on unregistered models
    const documents = await Document.find({});
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};