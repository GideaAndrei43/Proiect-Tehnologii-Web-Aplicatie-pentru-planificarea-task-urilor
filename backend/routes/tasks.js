const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const User = require("../models/User");

// --- CREATE TASK (MANAGER sau ADMIN) ---
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).send("Only managers or admins can create tasks");
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    createdById: req.user.id, // creator poate fi manager sau admin
    assignedToIds: [],        // initial empty
    status: "OPEN"
  });

  res.json({ ...task.toJSON(), assignedTo: [] });
});

// --- GET TASKS ---
router.get("/", auth, async (req, res) => {
  let where = {};

  // Manager vede doar task-urile create de el
  if (req.user.role === "manager") {
    where.createdById = req.user.id;
  }

  // Admin vede toate task-urile, executant vede doar ce e assignat lui
  const tasks = await Task.findAll({
    where,
    include: [{ model: User, as: "createdBy", attributes: ["id", "name"] }]
  });

  const allUsers = await User.findAll({ attributes: ["id", "name"] });

  const tasksWithUsers = tasks
    .map(t => {
      const assignedIds = t.assignedToIds || [];
      const assignedUsers = allUsers.filter(u => assignedIds.includes(u.id));
      return { ...t.toJSON(), assignedTo: assignedUsers, assignedToIds: assignedIds };
    })
    .filter(t => {
      if (req.user.role === "executant") {
        return t.assignedToIds.includes(req.user.id);
      }
      return true; // manager și admin văd toate task-urile lor
    });

  res.json(tasksWithUsers);
});

// --- GET TASK BY ID ---
router.get("/:id", auth, async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [{ model: User, as: "createdBy", attributes: ["id", "name"] }]
  });
  if (!task) return res.status(404).send("Task not found");

  const allUsers = await User.findAll({ attributes: ["id", "name"] });
  const assignedIds = task.assignedToIds || [];
  const assignedUsers = allUsers.filter(u => assignedIds.includes(u.id));

  res.json({ ...task.toJSON(), assignedTo: assignedUsers, assignedToIds: assignedIds });
});

// --- COMPLETE TASK (EXECUTANT) ---
router.post("/complete/:id", auth, async (req, res) => {
  if (req.user.role !== "executant") return res.status(403).send("Only executant");

  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send("Task not found");

  const assignedIds = task.assignedToIds || [];
  if (!assignedIds.includes(req.user.id)) return res.status(403).send("Not your task");

  task.status = "COMPLETED";
  await task.save();

  const allUsers = await User.findAll({ attributes: ["id", "name"] });
  const assignedUsers = allUsers.filter(u => assignedIds.includes(u.id));

  res.json({ ...task.toJSON(), assignedTo: assignedUsers, assignedToIds: assignedIds });
});

// --- CLOSE TASK (MANAGER, ADMIN sau EXECUTANT ASSIGNED) ---
router.post("/close/:id", auth, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send("Task not found");

  const assignedIds = task.assignedToIds || [];
  const isAssigned = assignedIds.includes(req.user.id);

  if (
    req.user.role === "manager" ||
    req.user.role === "admin" ||          // admin poate închide oricare task
    (req.user.role === "executant" && isAssigned)
  ) {
    task.status = "CLOSED";
    await task.save();

    const allUsers = await User.findAll({ attributes: ["id", "name"] });
    const assignedUsers = allUsers.filter(u => assignedIds.includes(u.id));

    return res.json({ ...task.toJSON(), assignedTo: assignedUsers, assignedToIds: assignedIds });
  }

  return res.status(403).send("Access denied");
});

// --- ASSIGN MULTI USERS (MANAGER sau ADMIN) ---
router.post("/assign-multi/:id", auth, async (req, res) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).send("Only managers or admins can assign users");
  }

  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send("Task not found");

  // Dacă e manager, poate doar la task-urile lui
  if (req.user.role === "manager" && task.createdById !== req.user.id) {
    return res.status(403).send("Not your task");
  }

  const userIds = req.body.userIds || [];
  task.assignedToIds = userIds;
  if (userIds.length) task.status = "PENDING"; // dacă are assign, devine pending
  await task.save();

  const allUsers = await User.findAll({ attributes: ["id", "name"] });
  const assignedUsers = allUsers.filter(u => userIds.includes(u.id));

  res.json({ ...task.toJSON(), assignedTo: assignedUsers, assignedToIds: userIds });
});

module.exports = router;
