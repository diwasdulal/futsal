import express from "express";
import { getCourts, getCourtById, addCourt, updateCourt, deleteCourt } from "../controllers/courtController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCourts);
router.post("/", addCourt);
router.get("/:id", getCourtById);
router.put("/:id", updateCourt);
router.delete("/:id", deleteCourt);

export default router;
