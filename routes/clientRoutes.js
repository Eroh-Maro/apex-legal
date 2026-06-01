// routes/clientRoutes.js

import express from "express";

import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients,
} from "../controllers/clientController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE CLIENT
router.post(
  "/create",
  protect,
  authorize("admin", "lawyer", "secretary"),
  createClient
);


// GET ALL CLIENTS
router.get(
  "/",
  protect,
  getClients
);


// SEARCH CLIENTS
router.get(
  "/search",
  protect,
  searchClients
);


// GET SINGLE CLIENT
router.get(
  "/:id",
  protect,
  getClientById
);


// UPDATE CLIENT
router.patch(
  "/:id",
  protect,
  authorize("admin", "lawyer", "secretary"),
  updateClient
);


// DELETE CLIENT
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteClient
);

export default router;