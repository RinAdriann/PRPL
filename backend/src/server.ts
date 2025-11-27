import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { lessonsRouter } from "./routes/lessons.js";
import { educatorRouter } from './routes/educator';
import { progressRouter } from './routes/progress';

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN || "https://eduvillage.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"))),
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRouter);
app.use("/api/lessons", lessonsRouter);
app.use('/api/educator', educatorRouter);
app.use('/api/progress', progressRouter);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`Backend listening on :${port}`));
