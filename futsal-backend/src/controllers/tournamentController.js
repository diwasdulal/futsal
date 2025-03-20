import pool from "../config/db.js";
import { sendTournamentAlert } from "../config/mail.js";

export const createTournament = async (req, res) => {
  try {
    const { name, start_date, end_date } = req.body;

    await pool.query("INSERT INTO tournaments (name, start_date, end_date) VALUES (?, ?, ?)", [name, start_date, end_date]);

    res.status(201).json({ message: "Tournament created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const [tournaments] = await pool.query("SELECT * FROM tournaments");
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const notifyUpcomingTournaments = async () => {
  try {
    const [tournaments] = await pool.query("SELECT * FROM tournaments WHERE start_date = CURDATE() + INTERVAL 3 DAY");

    for (let tournament of tournaments) {
      const [users] = await pool.query("SELECT email FROM users");
      for (let user of users) {
        await sendTournamentAlert(user.email, tournament);
      }
    }
  } catch (error) {
    console.error("Error sending tournament alerts:", error);
  }
};

// Run this function every day at midnight
setInterval(notifyUpcomingTournaments, 24 * 60 * 60 * 1000);
