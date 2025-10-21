import { Router } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireEducator } from "../middleware/auth.js";

export const authRouter = Router();

// POST /api/educator/register { name, email, password }
authRouter.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already used" });
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        role: "EDUCATOR",
        email,
        passwordHash,
        name,
        educator: { create: { defaultDifficulty: "BASIC" } },
      },
      include: { educator: true }
    });

    const token = jwt.sign(
      { userId: user.id, educatorId: user.educator!.id, role: "EDUCATOR" },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );
    res.status(201).json({ token, educatorId: user.educator!.id, name: user.name });
  } catch (e) {
    next(e);
  }
});

// POST /api/educator/login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const user = await prisma.user.findUnique({ where: { email }, include: { educator: true } });
    if (!user || !user.passwordHash || user.role !== "EDUCATOR") {
      return res.status(401).json({ error: "Access Denied" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Access Denied" });

    const token = jwt.sign(
      { userId: user.id, educatorId: user.educator?.id, role: "EDUCATOR" },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );
    res.json({ token, educatorId: user.educator?.id, name: user.name });
  } catch (e) {
    next(e);
  }
});

// GET /api/educator/verify
authRouter.get("/verify", requireEducator, async (_req, res) => {
  res.json({ ok: true });
});