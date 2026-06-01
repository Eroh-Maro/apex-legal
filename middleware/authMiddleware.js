// middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


// PROTECT ROUTES
export const protect = async (req, res, next) => {
  let token;

  // CHECK AUTH HEADER
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // GET TOKEN
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // FIND USER
      req.user = await User.findById(decoded.id).select("-password");

      // CHECK IF USER STILL EXISTS
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "User associated with this token no longer exists",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Security validation failed: invalid or expired token",
      });
    }
  }

  // NO TOKEN
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied: missing authorization token",
    });
  }
};


// ROLE AUTHORIZATION
export const authorize = (...roles) => {
  return (req, res, next) => {
    // CHECK USER ROLE
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `RBAC Restriction: Role [${req.user.role}] does not have permission to execute this task.`,
      });
    }

    next();
  };
};