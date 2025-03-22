import express from "express";
import {
  createTournament,
  deleteTournament,
  getMyRegistrations,
  getTeamsForTournament,
  getTournaments,
  getUpcomingTournaments,
  registerTeamForTournament,
  updateTournament,
} from "../controllers/tournamentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTournament);
router.get("/", protect, getTournaments);
router.put("/:id", protect, updateTournament);
router.delete("/:id", protect, deleteTournament);
router.get("/upcoming", getUpcomingTournaments);
router.post("/register-team", protect, registerTeamForTournament);
router.get("/my-registrations", protect, getMyRegistrations);
router.get("/:id/teams", getTeamsForTournament);

export default router;
