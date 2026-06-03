import Audit from "../models/auditModel.js";

const logAction = async (userId, userEmail, userRole, action, resource, resourceId, ipAddress, metadata, status) => {
  try {
    const auditLog = await Audit.create({
      userId,
      userEmail,
      userRole,
      action,
      resource,
      resourceId: resourceId? String(resourceId) : null,
      ipAddress,
      metadata,
      status
    });
    return auditLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
    throw error;
  }
};

const getAuditLogs = async (req,res) => {
  try {
   const {userId, userRole, action, resource, resourceId,status,startDate,endDate, page=1, limit=50} = req.query;
   const filter = {};
 
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (resourceId) filter.resourceId = resourceId;
    if (status) filter.status = status;
 
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        // Include the full end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
 
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // cap at 100
    const skip = (pageNum - 1) * limitNum;
 
    const [logs, total] = await Promise.all([
      Audit.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Audit.countDocuments(filter),
    ]);
 
    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
   } catch (err) {
    console.error("[AuditLog] getAuditLogs error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch audit logs." });
  }
};

const getLoginActivity = async (req, res) => {
    try {
      const { userId, status, startDate, endDate, page = 1, limit = 50 } = req.query;
   
      const filter = {
        resource: "Auth",
        action: { $in: ["LOGIN_SUCCESS", "LOGIN_FAILED", "LOGOUT"] },
      };
   
      if (userId) filter.userId = userId;
      if (status) filter.status = status;
   
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      }
   
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;
   
      const [logs, total] = await Promise.all([
        Audit.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Audit.countDocuments(filter),
      ]);
   
      return res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      console.error("[AuditLog] getLoginActivity error:", err.message);
      return res.status(500).json({ success: false, message: "Failed to fetch login activity." });
    }
  };
   
  // ─────────────────────────────────────────────
  //  GET /api/audit-logs/resource/:resourceId
  //  Returns full activity history for a specific case, client, or document
  //  Access: admin, lawyer (own cases only — enforce in middleware)
  // ─────────────────────────────────────────────
   
  const getResourceHistory = async (req, res) => {
    try {
      const { resourceId } = req.params;
      const { page = 1, limit = 50 } = req.query;
   
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;
   
      const filter = { resourceId: String(resourceId) };
   
      const [logs, total] = await Promise.all([
        Audit.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Audit.countDocuments(filter),
      ]);
   
      return res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      console.error("[AuditLog] getResourceHistory error:", err.message);
      return res.status(500).json({ success: false, message: "Failed to fetch resource history." });
    }
  };
   
export { logAction, getAuditLogs, getLoginActivity, getResourceHistory };