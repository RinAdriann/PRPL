import express from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const lessonsRouter = express.Router();

// Create lesson
lessonsRouter.post("/", auth, async (req, res) => {
  try {
    const { title, description, topic, difficulty, pages, ownerId } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description ?? null,
        topic: topic ?? null,
        difficulty: difficulty ?? null,
        pages: pages ?? null,
        ownerId: ownerId ?? null,
      },
    });
    res.status(201).json(lesson);
  } catch (err) {
    console.error("Create lesson error:", err);
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

// List lessons
lessonsRouter.get("/", auth, async (_req, res) => {
  try {
    const lessons = await prisma.lesson.findMany();
    res.json(lessons);
  } catch (err) {
    console.error("List lessons error:", err);
    res.status(500).json({ error: "Failed to list lessons" });
  }
});

export default lessonsRouter;
