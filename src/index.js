// Root-level entrypoint for scanners and deployment platforms
// Exports the Express app from the backend
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Proxy to backend - for development/deployment detection
app.get("/", (_req, res) => {
  res.json({ 
    message: "PRPL Backend API",
    health: "/api/health"
  });
});

export default app;
