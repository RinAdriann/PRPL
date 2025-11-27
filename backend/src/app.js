import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.js";
import educatorRouter from "./routes/educator.js";
import performanceRouter from "./routes/performance.js";
import progressRouter from "./routes/progress.js";
import quizzesRouter from "./routes/quizzes.js";
import lessonsRouter from "./routes/lessons.js";
import { prisma } from "./db.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(cors({ origin: true, credentials: true }));

app.get("/", (_req, res) => res.json({ ok: true, service: "PRPL Backend" }));

app.use("/auth", authRouter);
app.use("/educator", educatorRouter);
app.use("/performance", performanceRouter);
app.use("/progress", progressRouter);
app.use("/quizzes", quizzesRouter);
app.use("/lessons", lessonsRouter);

(async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected");
  } catch (e) {
    console.error("Prisma init error:", e);
  }
})();

export default app;