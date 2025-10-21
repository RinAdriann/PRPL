import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { lessonsRouter } from "./routes/lessons.js";
import { quizzesRouter } from "./routes/quizzes.js";
import { progressRouter } from "./routes/progress.js";
import { performanceRouter } from "./routes/performance.js";
import { educatorRouter } from "./routes/educator.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/educator", authRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/progress", progressRouter);
app.use("/api/performance", performanceRouter);
app.use("/api/educator", educatorRouter);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",
  });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`EduVillage API running on http://localhost:${port}`));
