// Fastify serverless entry (Vercel)
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

export default async function handler(req, res) {
	const app = Fastify({ logger: false });

	await app.register(fastifyCors, {
		origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
		credentials: true,
	});

	// Health + root
	app.get("/", async () => ({ ok: true, service: "fastify" }));
	app.get("/health", async () => ({ status: "ok" }));

	// Auth (demo: plain password; add hashing/JWT later)
	app.post("/auth/register", async (request, reply) => {
		const { email, password, role } = request.body || {};
		if (!email || !password || !role)
			return reply.code(400).send({ error: "Missing fields" });

		const exists = await prisma.user.findUnique({ where: { email } });
		if (exists) return reply.code(409).send({ error: "Email exists" });

		const user = await prisma.user.create({
			data: { email, password, role },
		});
		return {
			token: `demo-${user.id}`,
			user: { id: user.id, email: user.email, role: user.role },
		};
	});

	app.post("/auth/login", async (request, reply) => {
		const { email, password } = request.body || {};
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || user.password !== password)
			return reply.code(401).send({ error: "Invalid credentials" });
		return {
			token: `demo-${user.id}`,
			user: { id: user.id, email: user.email, role: user.role },
		};
	});

	// Lessons (+modules +quizzes +quizzesCount)
	app.get("/lessons", async () => {
		const lessons = await prisma.lesson.findMany({
			include: { modules: true, quizzes: true },
		});
		return lessons.map((l) => ({
			...l,
			quizzesCount: (l.quizzes || []).length,
		}));
	});

	// Enroll (create a join/record; if you don’t have a table, return ok)
	app.post("/lessons/:lessonId/enroll", async (request, reply) => {
		const { lessonId } = request.params;
		const found = await prisma.lesson.findUnique({
			where: { id: String(lessonId) },
		});
		if (!found) return reply.code(404).send({ error: "Lesson not found" });
		// If you have an Enrollment model, create it here. For now:
		return { ok: true };
	});

	// Quizzes by lesson
	app.get("/lessons/:lessonId/quizzes", async (request, reply) => {
		const { lessonId } = request.params;
		const lesson = await prisma.lesson.findUnique({
			where: { id: String(lessonId) },
			include: { quizzes: true },
		});
		if (!lesson) return reply.code(404).send({ error: "Lesson not found" });
		return lesson.quizzes || [];
	});

	// Progress per module
	app.post("/progress/module", async (request, reply) => {
		const { lessonId, moduleId, completed } = request.body || {};
		if (!lessonId || !moduleId)
			return reply.code(400).send({ error: "Missing ids" });

		const lesson = await prisma.lesson.findUnique({
			where: { id: String(lessonId) },
		});
		if (!lesson) return reply.code(404).send({ error: "Lesson not found" });

		const module = await prisma.module.findUnique({
			where: { id: String(moduleId) },
		});
		if (!module || module.lessonId !== lesson.id)
			return reply.code(404).send({ error: "Module not found" });

		const key = {
			userId_moduleId: { userId: "demo", moduleId: String(moduleId) },
		};
		const data = {
			userId: "demo",
			lessonId: String(lessonId),
			moduleId: String(moduleId),
			completedAt: completed ? new Date() : null,
		};

		const existing = await prisma.moduleProgress.findUnique({ where: key });
		const record = existing
			? await prisma.moduleProgress.update({ where: key, data })
			: await prisma.moduleProgress.create({ data });

		return {
			userId: record.userId,
			lessonId: record.lessonId,
			moduleId: record.moduleId,
			completedAt: record.completedAt ? record.completedAt.toISOString() : null,
		};
	});

	// Progress list (for Progress page)
	app.get("/progress", async () => {
		const rows = await prisma.moduleProgress.findMany({
			orderBy: [{ lessonId: "asc" }, { moduleId: "asc" }],
		});
		return rows.map((r) => ({
			userId: r.userId,
			lessonId: r.lessonId,
			moduleId: r.moduleId,
			completedAt: r.completedAt ? r.completedAt.toISOString() : null,
		}));
	});

	// Let Fastify handle the request
	await app.ready();
	app.server.emit("request", req, res);
}