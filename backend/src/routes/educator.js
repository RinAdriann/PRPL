import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const router = Router();

// GET educator by id (expects id as string in DB)
router.get("/:id", auth, async (req, res) => {
  try {
    const educatorId = String(req.params.id);
    const edu = await prisma.educator.findUnique({ where: { id: educatorId } });
    if (!edu) return res.status(404).json({ error: "Educator not found" });
    res.json(edu);
  } catch (err) {
    console.error("Get educator error:", err);
    res.status(500).json({ error: "Failed to get educator" });
  }
});

// Update educator
router.put("/:id", auth, async (req, res) => {
  try {
    const educatorId = String(req.params.id);
    const updated = await prisma.educator.update({
      where: { id: educatorId },
      data: req.body || {},
    });
    res.json(updated);
  } catch (err) {
    console.error("Update educator error:", err);
    res.status(500).json({ error: "Failed to update educator" });
  }
});

// List classrooms by educator
router.get("/:id/classrooms", auth, async (req, res) => {
  try {
    const educatorId = String(req.params.id);
    const classrooms = await prisma.classroom.findMany({
      where: { educatorId },
      include: { enrollments: true }, // ensure relation exists in schema
    });
    const result = classrooms.map((c) => ({
      id: c.id,
      name: c.name,
      size: Array.isArray(c.enrollments) ? c.enrollments.length : 0,
    }));
    res.json(result);
  } catch (err) {
    console.error("List classrooms error:", err);
    res.status(500).json({ error: "Failed to list classrooms" });
  }
});

export default router;