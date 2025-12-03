import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import lessonsRouter from "./routes/lessons.js";
import educatorRouter from "./routes/educator.js";
import progressRouter from "./routes/progress.js";
import quizzesRouter from "./routes/quizzes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("OK"));
app.use("/auth", authRouter);
app.use("/lessons", lessonsRouter);
app.use("/educator", educatorRouter);
app.use("/progress", progressRouter);
app.use("/quizzes", quizzesRouter);

export default app;
