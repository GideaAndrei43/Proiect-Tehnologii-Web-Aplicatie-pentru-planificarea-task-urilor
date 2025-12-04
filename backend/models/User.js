const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM("admin", "manager", "executant"),
    defaultValue: "executant",
  },
});

module.exports = User;
