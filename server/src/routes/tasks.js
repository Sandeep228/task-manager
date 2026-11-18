import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";

const router = Router();
const FIELDS = ["title", "priority", "due", "done"];

// Whitelist fields so clients can't set _id, createdAt, etc. (mass-assignment protection)
const pick = (body = {}) => Object.fromEntries(FIELDS.filter(f => body[f] !== undefined).map(f => [f, body[f]]));
const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid task id." });
  next();
});

// GET /api/tasks?status=all|active|done&q=text
router.get("/", wrap(async (req, res) => {
  const { status = "all", q = "" } = req.query;
  const filter = {};
  if (status === "active") filter.done = false;
  if (status === "done") filter.done = true;
  if (typeof q === "string" && q.trim()) filter.title = { $regex: escapeRegex(q.trim()), $options: "i" };
  res.json(await Task.find(filter).sort({ createdAt: -1 }));
}));

router.post("/", wrap(async (req, res) => {
  res.status(201).json(await Task.create(pick(req.body)));
}));

router.patch("/:id", wrap(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json(task);
}));

// Must come before "/:id"
router.delete("/", wrap(async (req, res) => {
  if (req.query.completed !== "true") return res.status(400).json({ error: "Use ?completed=true to clear finished tasks." });
  const { deletedCount } = await Task.deleteMany({ done: true });
  res.json({ deletedCount });
}));

router.delete("/:id", wrap(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.status(204).end();
}));

export default router;
