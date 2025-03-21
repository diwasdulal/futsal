import express from "express";
import { createTournament, deleteTournament, getTournaments, updateTournament } from "../controllers/tournamentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTournament);
router.get("/", protect, getTournaments);
router.put("/:id", protect, updateTournament);
router.delete("/:id", protect, deleteTournament);

export default router;
