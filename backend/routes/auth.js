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
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Email și parola sunt obligatorii" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ msg: "User inexistent" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Parola incorecta" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret123"
  );

  res.json({ token, role: user.role, userId: user.id });
});
module.exports = router;
