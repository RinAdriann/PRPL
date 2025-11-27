import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN || "https://eduvillage.vercel.app",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Import and mount routers if they exist
// import educatorRouter from "./routes/educator";
// import performanceRouter from "./routes/performance";
// import progressRouter from "./routes/progress";
// import quizzesRouter from "./routes/quizzes";
// app.use("/educator", educatorRouter);
// app.use("/performance", performanceRouter);
// app.use("/progress", progressRouter);
// app.use("/quizzes", quizzesRouter);

export default app;
{
  "engines": { "node": ">=18" }
}