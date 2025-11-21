import { Router } from "express";
import { prisma } from "../prisma.js";
import { auth } from "../middleware/auth.js";

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

// Update or create own progress
progressRouter.post("/", auth, async (req: any, res) => {
  const { lessonId, percent } = req.body;
  if (!lessonId || percent == null) return res.status(400).json({ error: "Missing fields" });
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  const data = await prisma.progress.upsert({
    where: { userId_lessonId: { userId: req.user.id, lessonId } },
    update: { percent },
    create: { userId: req.user.id, lessonId, percent },
  });
  res.json(data);
});

// List own progress
progressRouter.get("/mine", auth, async (req: any, res) => {
  const list = await prisma.progress.findMany({
    where: { userId: req.user.id },
    include: { lesson: { select: { id: true, title: true } } },
    orderBy: { updatedAt: 'desc' }
  });
  res.json(list);
});

// Educator view progress for their lesson
progressRouter.get("/lesson/:lessonId", auth, async (req: any, res) => {
  if (req.user.role !== "educator") return res.status(403).json({ error: "Educator only" });
  const { lessonId } = req.params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  if (lesson.ownerId !== req.user.id) return res.status(403).json({ error: "Not owner" });
  const list = await prisma.progress.findMany({ where: { lessonId } });
  res.json(list);
});
