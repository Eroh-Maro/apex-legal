// server.js

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import clientRoutes from "./routes/clientRoutes.js"
import caseRoutes from "./routes/caseRoutes.js"
import documentRoutes from "./routes/documentRoutes.js";
import hearingRoutes from "./routes/hearingRoutes.js";


dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/audits", auditRoutes)
app.use("/api/hearings", hearingRoutes);

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});