import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
    include: { educator: true }
  });
  const educatorId = eduUser.educator!.id;

  // Classrooms
  const classA = await prisma.classroom.create({ data: { educatorId, name: "Village A — Morning" } });
  const classB = await prisma.classroom.create({ data: { educatorId, name: "Village B — Afternoon" } });

  // Children
  const avatars = [
    "/assets/avatars/elephant.png",
    "/assets/avatars/lion.png",
    "/assets/avatars/giraffe.png",
    "/assets/avatars/monkey.png",
    "/assets/avatars/zebra.png",
    "/assets/avatars/panda.png",
  ];
  const namesA = ["Asha", "Babu", "Chaya"];
  const namesB = ["Deep", "Esha", "Farid"];

  async function createChild(name: string, avatar: string) {
    return prisma.user.create({
      data: { role: "CHILD", name, child: { create: { avatar } } },
      include: { child: true },
    });
  }

  const kidsA = await Promise.all(namesA.map((n, i) => createChild(n, avatars[i % avatars.length])));
  const kidsB = await Promise.all(namesB.map((n, i) => createChild(n, avatars[(i + 3) % avatars.length])));

  for (const u of kidsA) await prisma.enrollment.create({ data: { educatorId, childId: u.child!.id, classroomId: classA.id } });
  for (const u of kidsB) await prisma.enrollment.create({ data: { educatorId, childId: u.child!.id, classroomId: classB.id } });

  // Lessons
  const nature = await prisma.lesson.create({
    data: {
      title: "Plants and Nature",
      topic: "Nature",
      difficulty: "BASIC",
      pages: {
        create: [
          { pageNo: 1, imageUrl: "/assets/lessons/nature/plant1.jpg", audioUrl: "/assets/audio/nature/plant1.mp3", caption: "Plants need sun." },
          { pageNo: 2, imageUrl: "/assets/lessons/nature/plant2.jpg", audioUrl: "/assets/audio/nature/plant2.mp3", caption: "Plants need water." },
          { pageNo: 3, imageUrl: "/assets/lessons/nature/plant3.jpg", audioUrl: "/assets/audio/nature/plant3.mp3", caption: "Plants grow from seeds." },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      lessonId: nature.id,
      topic: "Nature",
      difficulty: "BASIC",
      questions: {
        create: [
          {
            type: "MATCHING",
            prompt: "Match pictures to words",
            items: JSON.stringify({ items: [{ key: "sun", label: "☀️" }, { key: "water", label: "💧" }, { key: "seed", label: "🌱" }] }),
            targets: JSON.stringify({ targets: [{ key: "seed", label: "Seed" }, { key: "sun", label: "Sun" }, { key: "water", label: "Water" }] }),
            answerMap: JSON.stringify({ sun: "sun", water: "water", seed: "seed" }),
          },
        ],
      },
    },
  });

  const counting = await prisma.lesson.create({
    data: {
      title: "Counting 1–5",
      topic: "Math",
      difficulty: "BASIC",
      pages: {
        create: [
          { pageNo: 1, imageUrl: "/assets/lessons/math/1.png", audioUrl: "/assets/audio/math/one.mp3", caption: "One" },
          { pageNo: 2, imageUrl: "/assets/lessons/math/2.png", audioUrl: "/assets/audio/math/two.mp3", caption: "Two" },
          { pageNo: 3, imageUrl: "/assets/lessons/math/3.png", audioUrl: "/assets/audio/math/three.mp3", caption: "Three" },
          { pageNo: 4, imageUrl: "/assets/lessons/math/4.png", audioUrl: "/assets/audio/math/four.mp3", caption: "Four" },
          { pageNo: 5, imageUrl: "/assets/lessons/math/5.png", audioUrl: "/assets/audio/math/five.mp3", caption: "Five" },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      lessonId: counting.id,
      topic: "Math",
      difficulty: "BASIC",
      questions: {
        create: [
          {
            type: "MATCHING",
            prompt: "Match number to dots",
            items: JSON.stringify({ items: [{ key: "1", label: "1" }, { key: "3", label: "3" }, { key: "5", label: "5" }] }),
            targets: JSON.stringify({ targets: [{ key: "1", label: "•" }, { key: "3", label: "•••" }, { key: "5", label: "•••••" }] }),
            answerMap: JSON.stringify({ "1": "1", "3": "3", "5": "5" }),
          },
        ],
      },
    },
  });

  console.log("Database seeded with educator, classes, children, lessons, and quizzes.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});