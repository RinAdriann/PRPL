import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const router = Router();

router.get("/:id", auth, async (req, res) => {
  try {
    const educatorId = String(req.params.id);
    const edu = await prisma.educator.findUnique({ where: { id: educatorId } });
    if (!edu) return res.status(404).json({ error: "Educator not found" });
    res.json(edu);
  } catch (e) {
    console.error("Educator fetch error:", e);
    res.status(500).json({ error: "Failed to fetch educator" });
  }
});

export default router;