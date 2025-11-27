import { Router } from "express";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";

const router = Router();

// Simple auth extraction
function getUser(req) {
  const h = req.headers.authorization;
  if (!h) return null;
  const token = h.replace("Bearer ","");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch { return null; }
}

// List progress
router.get("/", async (_req, res) => {
  const items = await prisma.moduleProgress.findMany();
  res.json(items);
});

// Toggle module completion
router.post("/module", async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Unauthenticated" });
  const { lessonId, moduleId, completed } = req.body;
  if (!lessonId || !moduleId) return res.status(400).json({ error: "Missing ids" });

  const existing = await prisma.moduleProgress.findUnique({
    where: { userId_moduleId: { userId: user.sub, moduleId } }
  });

  let record;
  if (!existing) {
    record = await prisma.moduleProgress.create({
      data: {
        userId: user.sub,
        lessonId,
        moduleId,
        completedAt: completed ? new Date() : null
      }
    });
  } else {
    record = await prisma.moduleProgress.update({
      where: { userId_moduleId: { userId: user.sub, moduleId } },
      data: { completedAt: completed ? new Date() : null }
    });
  }

  res.json(record);
});

export default router;
