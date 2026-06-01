// server.js

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import auditRoutes from "./routes/auditRoute.js";

dotenv.config();

const app = express();

app.use(express.json());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/audits", auditRoutes);


// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});