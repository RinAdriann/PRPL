import { Router } from "express";
import { prisma } from "../prisma.js";

export const lessonsRouter = Router();

// GET /api/lessons?topic=Nature&difficulty=BASIC
lessonsRouter.get("/", async (req, res, next) => {
  try {
    const { topic, difficulty } = req.query;
    const lessons = await prisma.lesson.findMany({
      where: {
        ...(topic ? { topic: String(topic) } : {}),
        ...(difficulty ? { difficulty: String(difficulty) as any } : {}),
      },
      include: { pages: { orderBy: { pageNo: "asc" } }, quiz: true },
      orderBy: { id: "asc" }
    });
    res.json(lessons);
  } catch (e) {
    next(e);
  }
});

// GET /api/lessons/:lessonId
lessonsRouter.get("/:lessonId", async (req, res, next) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { pages: { orderBy: { pageNo: "asc" } }, quiz: true },
    });
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (e) {
    next(e);
  }
});
