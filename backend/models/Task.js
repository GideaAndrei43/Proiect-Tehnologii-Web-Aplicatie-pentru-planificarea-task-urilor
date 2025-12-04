const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");

const Task = sequelize.define("Task", {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM("OPEN", "PENDING", "COMPLETED", "CLOSED"),
    defaultValue: "OPEN",
  }
});

// Relations
Task.belongsTo(User, { as: "assignedTo" });
Task.belongsTo(User, { as: "createdBy" });

module.exports = Task;
