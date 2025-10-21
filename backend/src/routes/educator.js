import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireEducator } from "../middleware/auth.js";
import { Difficulty } from "@prisma/client";

export const educatorRouter = Router();

// GET /api/educator/:educatorId/settings
educatorRouter.get("/:educatorId/settings", requireEducator, async (req, res, next) => {
  try {
    const educatorId = Number(req.params.educatorId);
    const edu = await prisma.educator.findUnique({ where: { id: educatorId } });
    if (!edu) return res.status(404).json({ error: "Educator not found" });
    res.json({ defaultDifficulty: edu.defaultDifficulty });
  } catch (e) {
    next(e);
  }
});

// POST /api/educator/:educatorId/settings { defaultDifficulty }
educatorRouter.post("/:educatorId/settings", requireEducator, async (req, res, next) => {
  try {
    const educatorId = Number(req.params.educatorId);
    const { defaultDifficulty } = req.body || {};
    if (!["BASIC", "ADVANCED"].includes(defaultDifficulty)) {
      return res.status(400).json({ error: "Invalid difficulty" });
    }
    const edu = await prisma.educator.update({
      where: { id: educatorId },
      data: { defaultDifficulty: defaultDifficulty as Difficulty },
    });
    res.json({ defaultDifficulty: edu.defaultDifficulty });
  } catch (e) {
    next(e);
  }
});
