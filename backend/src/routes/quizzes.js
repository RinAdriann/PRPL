import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const router = Router();

async function main() {
  // Educator
  const passwordHash = await bcrypt.hash("password123", 10);
  const eduUser = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      role: "EDUCATOR",
      email: "teacher@example.com",
      passwordHash,
      name: "Teacher One",
      educator: { create: { defaultDifficulty: "BASIC" } },
    },
  });

  // Child
  const childUser = await prisma.user.create({
    data: {
      role: "CHILD",
      name: "Asha",
      child: { create: { avatar: "/assets/avatars/elephant.png" } },
    },
  });

  // Enroll child
  await prisma.enrollment.create({
    data: {
      educatorId: eduUser.educator.id,
      childId: childUser.child.id,
    },
  });

  // Lesson with pages
  const natureLesson = await prisma.lesson.create({
    data: {
      title: "Plants and Nature",
      topic: "Nature",
      difficulty: "BASIC",
      pages: {
        create: [
          {
            pageNo: 1,
            imageUrl: "/assets/lessons/nature/plant1.jpg",
            audioUrl: "/assets/audio/nature/plant1.mp3",
            caption: "Plants need sun.",
          },
          {
            pageNo: 2,
            imageUrl: "/assets/lessons/nature/plant2.jpg",
            audioUrl: "/assets/audio/nature/plant2.mp3",
            caption: "Plants need water.",
          },
          {
            pageNo: 3,
            imageUrl: "/assets/lessons/nature/plant3.jpg",
            audioUrl: "/assets/audio/nature/plant3.mp3",
            caption: "Plants grow from seeds.",
          },
        ],
      },
    },
  });

  // Quiz for lesson
  await prisma.quiz.create({
    data: {
      lessonId: natureLesson.id,
      topic: "Nature",
      difficulty: "BASIC",
      questions: {
        create: [
          {
            type: "MATCHING",
            prompt: "Match pictures to words",
            items: JSON.stringify({
              items: [
                { key: "sun", label: "☀️" },
                { key: "water", label: "💧" },
                { key: "seed", label: "🌱" },
              ],
            }),
            targets: JSON.stringify({
              targets: [
                { key: "seed", label: "Seed" },
                { key: "sun", label: "Sun" },
                { key: "water", label: "Water" },
              ],
            }),
            answerMap: JSON.stringify({ sun: "sun", water: "water", seed: "seed" }),
          },
        ],
      },
    },
  });

  // Advanced content sample
  await prisma.lesson.create({
    data: {
      title: "Plant Life Cycle",
      topic: "Nature",
      difficulty: "ADVANCED",
      pages: {
        create: [
          {
            pageNo: 1,
            imageUrl: "/assets/lessons/nature/lifecycle1.jpg",
            audioUrl: "/assets/audio/nature/lifecycle1.mp3",
            caption: "Seed to sprout.",
          },
          {
            pageNo: 2,
            imageUrl: "/assets/lessons/nature/lifecycle2.jpg",
            audioUrl: "/assets/audio/nature/lifecycle2.mp3",
            caption: "Sprout to plant.",
          }
        ],
      },
    },
  });

  console.log("Database seeded.");
}

// Create quiz
router.post("/", auth, async (req, res) => {
  try {
    const { title, questions, lessonId, topic, difficulty } = req.body || {};
    if (!title || !questions) return res.status(400).json({ error: "title and questions are required" });

    // Example: derive educatorId from authenticated user (adjust to your auth shape)
    // Assuming req.user.id is a user id referencing an educator record
    let educatorId = null;
    if (req.user?.id) {
      const eduUser = await prisma.educator.findFirst({
        where: { userId: String(req.user.id) }
      });
      if (!eduUser || !eduUser.id) {
        return res.status(403).json({ error: "Educator context not found" });
      }
      educatorId = eduUser.id;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions,
        topic: topic ?? null,
        difficulty: difficulty ?? null,
        lessonId: lessonId ?? null,
        educatorId // include only if schema has this field
      },
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

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

export default router;