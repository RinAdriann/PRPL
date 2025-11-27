import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireEducator, auth } from "../middleware/auth.js";
export const educatorRouter = Router();
// GET /api/educator/:educatorId/settings
educatorRouter.get("/:educatorId/settings", requireEducator, async (req, res, next) => {
    try {
        const educatorId = Number(req.params.educatorId);
        const edu = await prisma.educator.findUnique({ where: { id: educatorId } });
        if (!edu)
            return res.status(404).json({ error: "Educator not found" });
        res.json({ defaultDifficulty: edu.defaultDifficulty });
    }
    catch (e) {
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
            data: { defaultDifficulty },
        });
        res.json({ defaultDifficulty: edu.defaultDifficulty });
    }
    catch (e) {
        next(e);
    }
});
// GET /api/educator/:educatorId/classes
educatorRouter.get("/:educatorId/classes", requireEducator, async (req, res, next) => {
    try {
        const educatorId = Number(req.params.educatorId);
        const classes = await prisma.classroom.findMany({
            where: { educatorId },
            include: { enrollments: true },
            orderBy: { id: "asc" }
        });
        const out = classes.map(c => ({
            id: c.id,
            name: c.name,
            size: c.enrollments.length
        }));
        res.json({ classes: out });
    }
    catch (e) {
        next(e);
    }
});
educatorRouter.get('/children', auth, requireEducator, async (req, res) => {
    const children = await prisma.child.findMany();
    res.json(children);
});
