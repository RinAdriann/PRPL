import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const router = Router();

// Create quiz
router.post("/", auth, async (req, res) => {
  try {
    const { title, questions, lessonId, topic, difficulty } = req.body || {};
    if (!title || !questions) return res.status(400).json({ error: "title and questions are required" });

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions,
        topic: topic ?? null,
        difficulty: difficulty ?? null,
        lessonId: lessonId ?? null
        // educatorId: add if model has it
      }
    });
    res.status(201).json(quiz);
  } catch (err) {
    console.error("Create quiz error:", err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// List quizzes
router.get("/", auth, async (_req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany();
    res.json(quizzes);
  } catch (err) {
    console.error("List quizzes error:", err);
    res.status(500).json({ error: "Failed to list quizzes" });
  }
});

export default router;