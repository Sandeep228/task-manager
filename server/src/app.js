import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import tasks from "./routes/tasks.js";

// Cache the connection so serverless invocations reuse it instead of reconnecting every time.
let connecting;
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  connecting ??= mongoose.connect(process.env.MONGO_URI).catch(err => { connecting = null; throw err; });
  await connecting;
}

export function createApp(origin = "http://localhost:5173") {
  const app = express();
  app.use(cors({ origin }));
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/tasks", async (_req, _res, next) => {
    try { await connectDB(); next(); } catch (e) { next(e); }
  });
  app.use("/api/tasks", tasks);

  app.use((_req, res) => res.status(404).json({ error: "Not found." }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join(" ") });
    }
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON." });
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server." });
  });
  return app;
}

export default createApp(process.env.CLIENT_ORIGIN); // Vercel needs this default export