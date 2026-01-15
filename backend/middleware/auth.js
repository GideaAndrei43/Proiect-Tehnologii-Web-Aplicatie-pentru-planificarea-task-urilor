// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // preia token din Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ia tokenul după Bearer

  if (!token) return res.status(401).json({ msg: "Acces interzis – nu există token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded; // id + role
    next();
  } catch (err) {
    res.status(403).json({ msg: "Token invalid" });
  }
};
