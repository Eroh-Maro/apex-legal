// models/caseModel.js

import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Case title is required"],
      trim: true,
    },

    caseNumber: {
      type: String,
      required: [true, "Case number is required"],
      unique: true,
      trim: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    assignedLawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caseType: {
      type: String,
      enum: [
        "Litigation",
        "Corporate Law",
        "Property Law",
        "Criminal Law",
        "Family Law",
        "Arbitration",
        "Commercial Transactions",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "pending",
        "in_court",
        "closed",
        "archived",
      ],
      default: "open",
    },

    description: {
      type: String,
      trim: true,
    },

    hearingDate: {
      type: Date,
    },

    courtName: {
      type: String,
      trim: true,
    },

    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    notes: [
      {
        body: {
          type: String,
          required: true,
        },

        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;