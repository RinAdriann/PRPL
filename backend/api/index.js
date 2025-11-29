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

  app.get("/health", async () => ({ status: "ok" }));

  await app.ready();
  app.server.emit("request", req, res);
}