import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { lessonsRouter } from "./routes/lessons.js";
import { educatorRouter } from "./routes/educator.js";
import { progressRouter } from "./routes/progress.js";

// Build and export the Express app WITHOUT calling listen()
export const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Routes (make sure these route modules export express Routers)
// Note: use .js extensions in imports and in route files as we fixed earlier.
app.use('/api/auth', authRouter);
app.use("/api/lessons", lessonsRouter);
app.use('/api/educator', educatorRouter);
app.use('/api/progress', progressRouter);