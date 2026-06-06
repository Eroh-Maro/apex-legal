import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: ["lawyer", "admin", "Secretary", "Practice Manager", "Paralegal"],
    },

    action: {
      type: String,
      enum: [
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "LOGOUT",

        "CREATE_USER",
        "UPDATE_USER",
        "DELETE_USER",
        "DEACTIVATE_USER",
        "REACTIVATE_USER",
        "UPDATE_USER_ROLE",

        "CREATE_CLIENT",
        "UPDATE_CLIENT",
        "DELETE_CLIENT",
        "VIEW_CLIENT",

        "CREATE_CASE",
        "UPDATE_CASE",
        "DELETE_CASE",
        "UPDATE_CASE_STATUS",
        "ADD_CASE_NOTE",
        "ASSIGN_CASE",
        "VIEW_CASE",

        "CREATE_HEARING",
        "UPDATE_HEARING",
        "DELETE_HEARING",

        "UPLOAD_DOCUMENT",
        "DOWNLOAD_DOCUMENT",
        "VIEW_DOCUMENT",

        "REMINDER_SENT",
        "REMINDER_FAILED",
        "REMINDER_RETRY",
      ],
      required: true,
      index: true,
    },
    resource: {
      type: String,
      enum: [
        "Auth",
        "User",
        "Client",
        "Case",
        "Hearing",
        "Document",
        "Notification",
      ],
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

auditSchema.index({
  userId: 1,
  userEmail: 1,
  userRole: 1,
  action: 1,
  resource: 1,
  resourceId: 1,
  ipAddress: 1,
});

auditSchema.index({
  createdAt: -1,
});

// Block all mutation operations to enforce immutability
auditSchema.pre(
  ["updateOne", "findOneAndUpdate", "findByIdAndUpdate", "updateMany"],
  function () {
    throw new Error("Audit logs are immutable and cannot be modified.");
  }
);

auditSchema.pre(
  ["deleteOne", "findOneAndDelete", "findByIdAndDelete", "deleteMany"],
  function () {
    throw new Error("Audit logs are immutable and cannot be deleted.");
  }
);

const Audit = mongoose.model("Audit", auditSchema);

export default Audit;
