import express from "express";
import { updateProfile, changePassword, getUsers, getUserBookings, banUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/", protect, protectAdmin, getUsers); // View all users (Admin only)
router.get("/:id/bookings", protect, getUserBookings); // Track bookings for a user (Admin can view)
router.put("/:id/ban", protect, protectAdmin, banUser); // Ban a user (Admin only)

export default router;
