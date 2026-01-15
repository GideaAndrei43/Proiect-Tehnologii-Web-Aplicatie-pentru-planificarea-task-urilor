const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");

const Task = sequelize.define("Task", {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM("OPEN", "PENDING", "COMPLETED", "CLOSED"),
    defaultValue: "OPEN",
  },
  assignedToIds: {  // array de user IDs pentru multi-assign
    type: DataTypes.JSON,
    defaultValue: []
  }
});


Task.belongsTo(User, { as: "createdBy" });

module.exports = Task;
