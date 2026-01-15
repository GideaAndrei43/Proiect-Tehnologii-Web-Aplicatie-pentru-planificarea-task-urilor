const { Sequelize } = require("sequelize");
const path = require("path");

// Folder “database” commit-uit în repo, astfel fișierul e inclus în build
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database", "database.sqlite"),
  logging: false,
});

module.exports = sequelize;
