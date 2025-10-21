import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireEducator } from "../middleware/auth.js";

export const performanceRouter = Router();

// GET /api/performance/:educatorId?topic=Nature
performanceRouter.get("/:educatorId", requireEducator, async (req, res, next) => {
  try {
    const educatorId = Number(req.params.educatorId);
    const topic = req.query.topic ? String(req.query.topic) : undefined;

    // Children in class
    const enrollments = await prisma.enrollment.findMany({
      where: { educatorId },
      include: { child: { include: { user: true } } },
    });
    const childIds = enrollments.map(e => e.childId);

    // Aggregates
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { childId: { in: childIds }, ...(topic ? { quiz: { topic } } : {}) },
      include: { quiz: true },
    });

    const progress = await prisma.progress.findMany({
      where: { childId: { in: childIds }, ...(topic ? { lesson: { topic } } : {}) },
      include: { lesson: true },
    });

    const avgScore =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
        : 0;

    const completionRateByLesson: Record<string, number> = {};
    const lessons = await prisma.lesson.findMany({ where: { ...(topic ? { topic } : {}) } });

    for (const lesson of lessons) {
      const completed = progress.filter(p => p.lessonId === lesson.id && p.completed).length;
      const rate = childIds.length > 0 ? Math.round((completed / childIds.length) * 100) : 0;
      completionRateByLesson[`${lesson.title}`] = rate;
    }

    res.json({
      classSize: childIds.length,
      averageQuizScore: avgScore,
      completionRateByLesson,
      totalQuizAttempts: quizAttempts.length,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/performance/:educatorId/children?topic=Nature
performanceRouter.get("/:educatorId/children", requireEducator, async (req, res, next) => {
  try {
    const educatorId = Number(req.params.educatorId);
    const topic = req.query.topic ? String(req.query.topic) : undefined;

    const enrollments = await prisma.enrollment.findMany({
      where: { educatorId },
      include: { child: { include: { user: true } } },
    });
    const childIds = enrollments.map(e => e.childId);

    const children = await prisma.child.findMany({
      where: { id: { in: childIds } },
      include: {
        user: true,
        quizAttempts: { include: { quiz: true } },
        progress: { include: { lesson: true } },
      },
    });

    // Summaries
    const data = children.map(c => {
      const attempts = topic ? c.quizAttempts.filter(a => a.quiz.topic === topic) : c.quizAttempts;
      const avgScore = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0;
      const completedLessons = topic ? c.progress.filter(p => p.completed && p.lesson.topic === topic) : c.progress.filter(p => p.completed);
      return {
        childId: c.id,
        name: c.user.name,
        avgScore,
        attempts: attempts.length,
        completedLessons: completedLessons.length,
      };
    }).sort((a, b) => b.avgScore - a.avgScore);

    res.json({ children: data });
  } catch (e) {
    next(e);
  }
});
