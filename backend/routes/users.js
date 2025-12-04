const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET ALL USERS
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).send("Access denied");
  }

  const users = await User.findAll({
    attributes: { exclude: ["password"] }
  });

  res.json(users);
});

// GET USER BY ID
router.get("/:id", auth, async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password"] }
  });

  if (!user) return res.status(404).send("User not found");

  res.json(user);
});

module.exports = router;
