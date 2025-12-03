import express from "express";
import { prisma } from "../db.js";
import { requireAuth as auth } from "../middleware/auth.js";

const educatorRouter = express.Router();

educatorRouter.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const educator = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, email: true, role: true }
    });
    if (!educator || educator.role !== "EDUCATOR") {
      return res.status(404).json({ error: "Educator not found" });
    }
    res.json(educator);
  } catch (err) {
    console.error("Get educator error:", err);
    res.status(500).json({ error: "Failed to get educator" });
  }
});

export default educatorRouter;