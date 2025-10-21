import { Router } from "express";
import { prisma } from "../prisma.js";

export const quizzesRouter = Router();

// GET /api/quizzes/:quizId
quizzesRouter.get("/:quizId", async (req, res, next) => {
  try {
    const quizId = Number(req.params.quizId);
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) return res.status(404).json({ error: "Quiz not available" });
    res.json(quiz);
  } catch (e) {
    next(e);
  }
});

// POST /api/quizzes/submit
// body: { childId, quizId, answers: Array<{questionId, mapping: Record<string,string>}> }
quizzesRouter.post("/submit", async (req, res, next) => {
  try {
    const started = Date.now();
    const { childId, quizId, answers } = req.body || {};
    if (!childId || !quizId || !Array.isArray(answers)) return res.status(400).json({ error: "Invalid payload" });

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) return res.status(404).json({ error: "Quiz not available" });

    let correctCount = 0;
    const feedback: Array<{ questionId: number; correct: boolean }> = [];

    for (const q of quiz.questions) {
      const ans = answers.find((a: any) => a.questionId === q.id);
      let isCorrect = false;
      if (ans && typeof ans.mapping === "object") {
        const correctMap = q.answerMap as any;
        const keys = Object.keys(correctMap);
        isCorrect = keys.every(k => ans.mapping[k] === correctMap[k]);
      }
      if (isCorrect) correctCount++;
      feedback.push({ questionId: q.id, correct: isCorrect });
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= 80;

    await prisma.quizAttempt.create({
      data: { childId, quizId, score, passed },
    });

    // Award badge on pass
    if (passed) {
      await prisma.reward.create({
        data: {
          childId,
          name: `Nature Star`,
          iconUrl: "/assets/badges/star.png",
        },
      });
      // Level up
      await prisma.child.update({
        where: { id: childId },
        data: { unlockedLvl: { increment: 1 } },
      });
    }

    // Near real-time
    const elapsed = Date.now() - started;
    res.json({ feedback, score, passed, elapsedMs: elapsed });
  } catch (e) {
    next(e);
  }
});
