import 'dotenv/config';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { app } from '../dist/app.js';
import { PrismaClient } from '@prisma/client';

// Configure region / memory / timeout if you want
setGlobalOptions({ region: 'us-central1' }); // change region if you prefer

// Prisma singleton for serverless environments (reduces client recreation)
if (!globalThis.__prisma) {
  globalThis.__prisma = new PrismaClient({ log: ['error'] });
}
const prisma = globalThis.__prisma;

// Optionally attach prisma to app.locals so routes can access it:
// (Assumes your route code uses req.app.locals.prisma or similar)
if (!app.locals) app.locals = {};
app.locals.prisma = prisma;

// Export the Express app as a Firebase Function
// onRequest forwards HTTP requests to the Express app.
export const api = onRequest(app);