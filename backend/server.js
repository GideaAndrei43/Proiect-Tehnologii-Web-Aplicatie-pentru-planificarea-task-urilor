require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./sequelize");


require("./models/User");
require("./models/Task");

const app = express();
app.use(cors());
app.use(express.json());

// Sync SQLite database
sequelize.sync().then(() => {
  console.log("SQLite DB synced");
});

app.get("/", (req, res) => {
  res.send("Server works!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
