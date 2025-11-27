import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import educatorRouter from "./routes/educator.js";
import performanceRouter from "./routes/performance.js";
import progressRouter from "./routes/progress.js";
import quizzesRouter from "./routes/quizzes.js";
import lessonsRouter from "./routes/lessons.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN || "https://eduvillage.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/educator", educatorRouter);
app.use("/performance", performanceRouter);
app.use("/progress", progressRouter);
app.use("/quizzes", quizzesRouter);
app.use("/lessons", lessonsRouter);

export default app;