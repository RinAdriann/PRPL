import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const router = Router();

// Example: aggregate enrollments by educator
router.get("/:id/summary", auth, async (req, res) => {
  try {
    const educatorId = String(req.params.id);
    const enrollments = await prisma.enrollment.findMany({ where: { educatorId } });
    res.json({ count: enrollments.length });
  } catch (err) {
    console.error("Performance summary error:", err);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

export default router;
