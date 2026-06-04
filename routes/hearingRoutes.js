import express from "express";

import {
  createHearing,
  getHearings,
  getHearingById,
  updateHearing,
  deleteHearing,
  getHearingsByCase,
  addHearingNote,
} from "../controllers/hearingController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE HEARING
router.post(
  "/create",
  protect,
  authorize("secretary", "lawyer"),
  createHearing
);

// GET ALL HEARINGS
router.get(
  "/",
  protect,
  getHearings
);

// GET HEARINGS FOR A CASE
router.get(
  "/case/:caseId",
  protect,
  getHearingsByCase
);

// GET SINGLE HEARING
router.get(
  "/:id",
  protect,
  getHearingById
);

// ADD NOTE TO HEARING
router.post(
  "/:id/notes",
  protect,
  authorize("secretary", "lawyer"),
  addHearingNote
);

// UPDATE HEARING
router.patch(
  "/:id",
  protect,
  authorize("secretary", "lawyer"),
  updateHearing
);

// DELETE HEARING
router.delete(
  "/:id",
  protect,
  authorize("secretary", "lawyer"),
  deleteHearing
);

export default router;