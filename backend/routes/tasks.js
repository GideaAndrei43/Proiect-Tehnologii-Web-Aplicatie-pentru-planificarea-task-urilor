const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const User = require("../models/User");

// CREATE TASK (MANAGER)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).send("Only managers can create tasks");

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    createdById: req.user.id
  });

  res.json(task);
});

// GET ALL TASKS
router.get("/", auth, async (req, res) => {
  const tasks = await Task.findAll({
    include: [
      { model: User, as: "assignedTo" },
      { model: User, as: "createdBy" }
    ]
  });

  res.json(tasks);
});

// ASSIGN TASK
router.post("/assign/:id", auth, async (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).send("Only managers can assign tasks");

  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send("Task not found");

  task.assignedToId = req.body.userId;
  task.status = "PENDING";
  await task.save();

  res.json(task);
});

// COMPLETE TASK (EXECUTANT)
router.post("/complete/:id", auth, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send("Task not found");

  task.status = "COMPLETED";
  await task.save();

  res.json(task);
});

// CLOSE TASK (MANAGER)
router.post("/close/:id", auth, async (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).send("Only managers can close tasks");

  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send("Task not found");

  task.status = "CLOSED";
  await task.save();

  res.json(task);
});

module.exports = router;
