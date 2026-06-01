import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case", // Structural reference back to the case container
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true, // Secure Storage URL reference 
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Audit log tracking the explicit team member who handled upload
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Litigation",
        "Corporate Law",
        "Property Law",
        "Criminal Law",
        "Family Law",
        "Arbitration",
        "Internal Template",
        "Compliance",
      ], // Extracted strictly from the Appendix guidelines
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    fileMetadata: {
      sizeInBytes: { type: Number },
      mimeType: { type: String },
      evidenceChecksum: { type: String }, // SHA-256 cryptographic proof to satisfy the Nigerian Evidence Act
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;