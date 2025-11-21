import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { lessonsRouter } from "./routes/lessons.js";
import { educatorRouter } from './routes/educator';
import { progressRouter } from './routes/progress';

const app = express();
app.use(cors({
  origin: [/http:\/\/localhost:\d+$/],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRouter);
app.use("/api/lessons", lessonsRouter);
app.use('/api/educator', educatorRouter);
app.use('/api/progress', progressRouter);

const desired = parseInt(process.env.PORT || '4000', 10);

function start(p: number) {
  app.listen(p)
    .on('listening', () => console.log(`Backend listening on :${p}`))
    .on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${p} in use, trying ${p + 1}`);
        start(p + 1);
      } else {
        console.error(err);
        process.exit(1);
      }
    });
}

start(desired);
