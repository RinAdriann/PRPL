import { Router } from "express";
import { prisma } from "../prisma.js";

export const progressRouter = Router();

// POST /api/progress/lesson { childId, lessonId }
progressRouter.post("/lesson", async (req, res, next) => {
  try {
    const { childId, lessonId } = req.body || {};
    if (!childId || !lessonId) return res.status(400).json({ error: "Invalid payload" });

    const progress = await prisma.progress.upsert({
      where: { childId_lessonId: { childId, lessonId } as any },
      update: { completed: true, completedAt: new Date() },
      create: { childId, lessonId, completed: true, completedAt: new Date() },
    }).catch(async () => {
      // Create unique index workaround for SQLite composite
      const existing = await prisma.progress.findFirst({ where: { childId, lessonId } });
      if (existing) {
        return prisma.progress.update({ where: { id: existing.id }, data: { completed: true, completedAt: new Date() } });
      }
      return prisma.progress.create({ data: { childId, lessonId, completed: true, completedAt: new Date() } });
    });

    res.json({ ok: true, progress });
  } catch (e) {
    next(e);
  }
});

// POST /api/progress/update { childId }
// This can be extended to update rewards or other metadata if needed.
progressRouter.post("/update", async (req, res, next) => {
  try {
    const { childId } = req.body || {};
    if (!childId) return res.status(400).json({ error: "Invalid payload" });

    const rewards = await prisma.reward.findMany({ where: { childId } });
    const child = await prisma.child.findUnique({ where: { id: childId } });
    res.json({ rewards, unlockedLvl: child?.unlockedLvl ?? 1 });
  } catch (e) {
    next(e);
  }
});
