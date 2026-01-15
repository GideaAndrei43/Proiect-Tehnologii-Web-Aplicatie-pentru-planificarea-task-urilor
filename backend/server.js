// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./sequelize");

// Import modele
require("./models/User");
require("./models/Task");

// --- Initialize app ---
const app = express();

// --- Middleware ---
app.use(cors({
  origin: "*" // pentru test/dev; pentru productie poti seta URL-ul frontend-ului
}));
app.use(express.json());

// --- Sync SQLite database ---
sequelize.sync({ alter: true }) // creeaza tabele noi fara sa stearga datele existente
  .then(() => console.log("✅ SQLite DB synced"))
  .catch(err => console.error("❌ DB sync error:", err));

// --- Routes ---
app.get("/", (req, res) => {
  res.send("Server works!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
