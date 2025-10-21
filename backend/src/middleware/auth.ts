import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: number;
  educatorId?: number;
  role: "EDUCATOR" | "CHILD";
}

export function requireEducator(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Access Denied" });
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    if (payload.role !== "EDUCATOR") return res.status(403).json({ error: "Access Denied" });
    (req as any).auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
