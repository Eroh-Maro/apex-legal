// routes/caseRoutes.js

import express from "express";

import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  updateCaseStatus,
  addCaseNote,
  searchCases,
  getCasesByClient,
  getLawyerCases,
  getCasesByStatus,
} from "../controllers/caseController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE CASE
router.post(
  "/create",
  protect,
  authorize("admin", "lawyer"),
  createCase
);

router.get("/search", protect, searchCases);

router.get(
  "/status/:status",
  protect,
  getCasesByStatus
);

router.get(
  "/client/:clientId",
  protect,
  getCasesByClient
);

router.get(
  "/lawyer/:lawyerId",
  protect,
  getLawyerCases
);


// GET ALL CASES
router.get(
  "/",
  protect,
  getCases
);


// GET SINGLE CASE
router.get(
  "/:id",
  protect,
  getCaseById
);


// PATCH CASE
router.patch(
  "/:id",
  protect,
  authorize("admin", "lawyer"),
  updateCase
);


// DELETE CASE
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCase
);


// UPDATE CASE STATUS
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "lawyer"),
  updateCaseStatus
);


// ADD NOTE
router.post(
  "/:id/notes",
  protect,
  authorize("admin", "lawyer"),
  addCaseNote
);


export default router;