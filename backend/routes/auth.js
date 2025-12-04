const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error at REGISTER");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email }});

    if (!user) return res.status(400).send("User not found");

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secret123",
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error at LOGIN");
  }
});

module.exports = router;
