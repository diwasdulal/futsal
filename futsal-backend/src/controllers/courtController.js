import pool from "../config/db.js";

export const getCourts = async (req, res) => {
  try {
    const [courts] = await pool.query("SELECT * FROM courts");
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourtById = async (req, res) => {
  try {
    const [court] = await pool.query("SELECT * FROM courts WHERE id = ?", [req.params.id]);
    if (court.length === 0) return res.status(404).json({ message: "Court not found" });
    res.json(court[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new court
export const addCourt = async (req, res) => {
  try {
    const { name, location, price_per_hour, available_slots } = req.body;
    const [result] = await pool.query("INSERT INTO courts (name, location, price_per_hour, available_slots) VALUES (?, ?, ?, ?)", [
      name,
      location,
      price_per_hour,
      available_slots,
    ]);
    res.status(201).json({ message: "Court added successfully", courtId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing court
export const updateCourt = async (req, res) => {
  try {
    const { name, location, price_per_hour, available_slots } = req.body;
    const { id } = req.params;
    const [result] = await pool.query("UPDATE courts SET name = ?, location = ?, price_per_hour = ?, available_slots = ? WHERE id = ?", [
      name,
      location,
      price_per_hour,
      available_slots,
      id,
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Court not found" });
    res.json({ message: "Court updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a court
export const deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM courts WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Court not found" });
    res.json({ message: "Court deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
