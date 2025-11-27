import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

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

app.get("/health", (_req, res) => res.json({ ok: true }));

// mount routes here
// app.use("/auth", authRouter);

export default app;