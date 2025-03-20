import express from "express";
import { createTournament, getTournaments } from "../controllers/tournamentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTournament);
router.get("/", protect, getTournaments);

export default router;
