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

export const updateTournament = async (req, res) => {
  try {
    const { name, start_date, end_date } = req.body;
    const { id } = req.params;
    const [result] = await pool.query("UPDATE tournaments SET name = ?, start_date = ?, end_date = ? WHERE id = ?", [name, start_date, end_date, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tournament not found" });
    res.json({ message: "Tournament updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM tournaments WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tournament not found" });
    res.json({ message: "Tournament deleted successfully" });
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

// Get upcoming tournaments
export const getUpcomingTournaments = async (req, res) => {
  try {
    const [tournaments] = await pool.query("SELECT * FROM tournaments WHERE start_date >= CURDATE() ORDER BY start_date ASC");
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register team
export const registerTeamForTournament = async (req, res) => {
  try {
    const { tournament_id, team_name, members } = req.body;
    const user_id = req.user.id;

    if (!tournament_id || !team_name || !members) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await pool.query("INSERT INTO teams (user_id, tournament_id, team_name, members) VALUES (?, ?, ?, ?)", [user_id, tournament_id, team_name, members]);

    res.status(201).json({ message: "Team registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [registrations] = await pool.query(
      `SELECT t.id as tournament_id, t.name, t.start_date, t.end_date
       FROM teams tt
       JOIN tournaments t ON tt.tournament_id = t.id
       WHERE tt.user_id = ?`,
      [user_id]
    );

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeamsForTournament = async (req, res) => {
  const tournamentId = req.params.id;

  try {
    const [teams] = await pool.query(
      `SELECT id, team_name, members, created_at 
       FROM teams 
       WHERE tournament_id = ?`,
      [tournamentId]
    );

    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Failed to retrieve teams" });
  }
};
