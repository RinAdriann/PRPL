import express from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const progressRouter = express.Router();

// List progress
progressRouter.get("/", auth, async (_req, res) => {
  try {
    const progress = await prisma.progress.findMany();
    res.json(progress);
  } catch (err) {
    console.error("List progress error:", err);
    res.status(500).json({ error: "Failed to list progress" });
  }
});

// Toggle module completion
progressRouter.post("/module", auth, async (req, res) => {
  const user = req.user; // set by auth middleware
  const { lessonId, moduleId, completed } = req.body;
  if (!lessonId || !moduleId) return res.status(400).json({ error: "Missing ids" });

  const existing = await prisma.moduleProgress.findUnique({
    where: { userId_moduleId: { userId: user.sub, moduleId } }
  });

  let record;
  if (!existing) {
    record = await prisma.moduleProgress.create({
      data: {
        userId: user.sub,
        lessonId,
        moduleId,
        completedAt: completed ? new Date() : null
      }
    });
  } else {
    record = await prisma.moduleProgress.update({
      where: { userId_moduleId: { userId: user.sub, moduleId } },
      data: { completedAt: completed ? new Date() : null }
    });
  }

  res.json(record);
});

export default progressRouter;
