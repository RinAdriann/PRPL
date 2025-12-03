import app from "./src/server.js";
import { onRequest } from "firebase-functions/v2/https";

export const api = onRequest(
  { region: "us-central1", cors: true, secrets: ["DATABASE_URL", "JWT_SECRET"] },
  app
);