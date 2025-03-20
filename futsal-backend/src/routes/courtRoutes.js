import express from "express";
import { getCourts, getCourtById } from "../controllers/courtController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCourts);
router.get("/:id", getCourtById);

export default router;
