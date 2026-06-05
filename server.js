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
import reminderRoutes from "./routes/reminderRoutes.js";
import testEmailRoutes from "./routes/testEmailRoutes.js";
import startHearingReminderScheduler from "./utils/hearingReminderScheduler.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


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
app.use("/api/reminders", reminderRoutes);
app.use("/api/test-email", testEmailRoutes);
app.use("/api/dashboard", dashboardRoutes);

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

startHearingReminderScheduler();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});