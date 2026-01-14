const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM("admin", "manager", "executant"),
    defaultValue: "executant",
  },
  managerId: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = User;
