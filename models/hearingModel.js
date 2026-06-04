import mongoose from "mongoose";

const hearingSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    hearingDate: {
      type: Date,
      required: true,
    },

    courtName: {
      type: String,
      required: true,
      trim: true,
    },

    courtroom: {
      type: String,
      trim: true,
    },

    judge: {
      type: String,
      trim: true,
    },

    notes: [
      {
        body: {
          type: String,
          required: true,
          trim: true,
        },

        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },

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

const Hearing = mongoose.model("Hearing", hearingSchema);

export default Hearing;