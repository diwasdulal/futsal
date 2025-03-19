import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../models/userModel.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await pool.query("UPDATE users SET name = ?, phone = ? WHERE id = ?", [name, phone, req.user.id]);
    res.json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await findUserByEmail(req.user.email);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);

    res.json({ message: "Password changed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
