import { PrismaClient, Role, Difficulty, QuizQuestionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Educator
  const passwordHash = await bcrypt.hash("password123", 10);
  const eduUser = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      role: Role.EDUCATOR,
      email: "teacher@example.com",
      passwordHash,
      name: "Teacher One",
      educator: { create: { defaultDifficulty: Difficulty.BASIC } },
    },
  });

  // Child
  const childUser = await prisma.user.create({
    data: {
      role: Role.CHILD,
      name: "Asha",
      child: { create: { avatar: "/assets/avatars/elephant.png" } },
    },
  });

  // Enroll child
  await prisma.enrollment.create({
    data: {
      educatorId: eduUser.educator!.id,
      childId: childUser.child!.id,
    },
  });

  // Lesson with pages
  const natureLesson = await prisma.lesson.create({
    data: {
      title: "Plants and Nature",
      topic: "Nature",
      difficulty: Difficulty.BASIC,
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
      difficulty: Difficulty.BASIC,
      questions: {
        create: [
          {
            type: QuizQuestionType.MATCHING,
            prompt: "Match pictures to words",
            items: {
              items: [
                { key: "sun", label: "☀️" },
                { key: "water", label: "💧" },
                { key: "seed", label: "🌱" },
              ],
            },
            targets: {
              targets: [
                { key: "seed", label: "Seed" },
                { key: "sun", label: "Sun" },
                { key: "water", label: "Water" },
              ],
            },
            answerMap: { sun: "sun", water: "water", seed: "seed" },
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
      difficulty: Difficulty.ADVANCED,
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

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
