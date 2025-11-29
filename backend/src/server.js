// Load .env in non-production only
if (process.env.NODE_ENV !== 'production') {
  // dynamic import so production doesn't require the package if you remove it later
  import('dotenv/config').catch(() => {});
}

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { lessonsRouter } from "./routes/lessons.js";
import { educatorRouter } from './routes/educator.js';
import { progressRouter } from './routes/progress.js';

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`Backend listening on :${port}`));

const app = express();
