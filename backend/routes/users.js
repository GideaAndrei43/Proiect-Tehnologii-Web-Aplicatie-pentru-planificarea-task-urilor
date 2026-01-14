const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
//ASSIGN MANAGER
router.put("/assign-manager/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send("Only admin");

  const user = await User.findByPk(req.params.id);
  user.managerId = req.body.managerId;
  await user.save();

  res.json(user);
});
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Only admin" });

  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.update(req.body);
  res.json(user);
});

// ADD USER (ADMIN)
// ADD USER (ADMIN)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Only admin");

  const { name, email, password, role, managerId } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    managerId: role === "executant" ? managerId : null
  });

  res.json(user);
});

// DELETE USER (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Only admin" });

  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.destroy();
  res.json({ message: "User deleted" });
});





module.exports = router;
