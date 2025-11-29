// Fastify serverless entry (Vercel)
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });
function iso(d) { return d ? d.toISOString() : null; }

export default async function handler(req, res) {
  const app = Fastify({ logger: false });

  await app.register(fastifyCors, {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true
  });

  // Root & health
  app.get("/", async () => ({ ok: true, service: "fastify" }));
  app.get("/health", async () => ({ status: "ok" }));

  // Auth (demo: plain password)
  app.post("/auth/register", async (r, reply) => {
    const { email, password, role } = r.body || {};
    if (!email || !password || !role) return reply.code(400).send({ error: "Missing fields" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return reply.code(409).send({ error: "Email exists" });
    const user = await prisma.user.create({ data: { email, password, role } });
    return { token: `demo-${user.id}`, user: { id: user.id, email: user.email, role: user.role } };
  });

  app.post("/auth/login", async (r, reply) => {
    const { email, password } = r.body || {};
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) return reply.code(401).send({ error: "Invalid credentials" });
    return { token: `demo-${user.id}`, user: { id: user.id, email: user.email, role: user.role } };
  });

  // Lessons list
  app.get("/lessons", async () => {
    const lessons = await prisma.lesson.findMany({ include: { modules: true, quizzes: true } });
    return lessons.map(l => ({ ...l, quizzesCount: (l.quizzes || []).length }));
  });

  // Enroll (placeholder)
  app.post("/lessons/:lessonId/enroll", async (r, reply) => {
    const { lessonId } = r.params;
    const lesson = await prisma.lesson.findUnique({ where: { id: String(lessonId) } });
    if (!lesson) return reply.code(404).send({ error: "Lesson not found" });
    return { ok: true };
  });

  // Quizzes by lesson
  app.get("/lessons/:lessonId/quizzes", async (r, reply) => {
    const { lessonId } = r.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: String(lessonId) },
      include: { quizzes: true }
    });
    if (!lesson) return reply.code(404).send({ error: "Lesson not found" });
    return lesson.quizzes || [];
  });

  // Progress per module
  app.post("/progress/module", async (r, reply) => {
    const { lessonId, moduleId, completed } = r.body || {};
    if (!lessonId || !moduleId) return reply.code(400).send({ error: "Missing ids" });

    const lesson = await prisma.lesson.findUnique({ where: { id: String(lessonId) } });
    if (!lesson) return reply.code(404).send({ error: "Lesson not found" });

    const module = await prisma.module.findUnique({ where: { id: String(moduleId) } });
    if (!module || module.lessonId !== lesson.id) return reply.code(404).send({ error: "Module not found" });

    const key = { userId_moduleId: { userId: "demo", moduleId: String(moduleId) } };
    const existing = await prisma.moduleProgress.findUnique({ where: key });
    const data = {
      userId: "demo",
      lessonId: String(lessonId),
      moduleId: String(moduleId),
      completedAt: completed ? new Date() : null
    };
    const record = existing
      ? await prisma.moduleProgress.update({ where: key, data })
      : await prisma.moduleProgress.create({ data });

    return {
      userId: record.userId,
      lessonId: record.lessonId,
      moduleId: record.moduleId,
      completedAt: iso(record.completedAt)
    };
  });

  // Progress list
  app.get("/progress", async () => {
    const rows = await prisma.moduleProgress.findMany({
      orderBy: [{ lessonId: "asc" }, { moduleId: "asc" }]
    });
    return rows.map(r => ({
      userId: r.userId,
      lessonId: r.lessonId,
      moduleId: r.moduleId,
      completedAt: iso(r.completedAt)
    }));
  });

  // Placeholder educator/performance routes (add real logic later)
  app.get("/educator/summary", async () => ({ pending: 0 }));
  app.get("/performance/overview", async () => ({ metrics: [] }));

  await app.ready();
  app.server.emit("request", req, res);
}