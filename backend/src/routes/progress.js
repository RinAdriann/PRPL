import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const router = Router();

// Upsert progress by user+lesson or child+lesson, based on your schema
router.post("/", auth, async (req, res) => {
  try {
    const { childId, lessonId } = req.body || {};
    if (!childId || !lessonId) return res.status(400).json({ error: "childId and lessonId required" });

    // Assuming unique([userId, lessonId]) or child-based progress:
    const existing = await prisma.progress.findFirst({ where: { childId, lessonId } });
    if (existing) {
      const updated = await prisma.progress.update({
        where: { id: existing.id },
        data: { completed: true, completedAt: new Date() },
      });
      return res.json(updated);
    }
    const created = await prisma.progress.create({
      data: { childId, lessonId, completed: true, completedAt: new Date() },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error("Progress upsert error:", err);
    res.status(500).json({ error: "Failed to upsert progress" });
  }
});

export default router;
