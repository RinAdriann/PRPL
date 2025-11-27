import { PrismaClient } from "@prisma/client";

const globalAny = globalThis;

export const prisma =
  globalAny.__prisma || (globalAny.__prisma = new PrismaClient());