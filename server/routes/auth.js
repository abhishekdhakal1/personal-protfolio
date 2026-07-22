const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Admin login — credentials are read from ADMIN_EMAIL / ADMIN_PASSWORD env vars
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Credentials are required" });
    }

    const adminIdentifier = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
    const adminPassword   = process.env.ADMIN_PASSWORD;

    if (!adminIdentifier || !adminPassword) {
      return res.status(500).json({ error: "Admin credentials not configured on server" });
    }

    if (username !== adminIdentifier || password !== adminPassword) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET not configured on server" });
    }

    const token = jwt.sign(
      { id: "admin", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ success: true, token, user: { id: "admin", role: "admin" } });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
