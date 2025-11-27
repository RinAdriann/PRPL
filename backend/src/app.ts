import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins: string[] = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN || "https://eduvillage.vercel.app",
].filter(Boolean) as string[];

type CorsCallback = (err: Error | null, allow?: boolean) => void;

app.use(
  cors({
    origin: (origin: string | undefined, cb: CorsCallback): void => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default app;
{
  "engines": { "node": ">=18" }
}