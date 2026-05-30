import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Adjust filename case if necessary (e.g., UserModel.js)

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ error: "Security validation failed: invalid token" });
    }
  }
  if (!token) {
    return res.status(401).json({ error: "Access denied: missing authorization token" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `RBAC Restriction: Role [${req.user.role}] does not have permission to execute this task.`,
    });
  }
  next();
};