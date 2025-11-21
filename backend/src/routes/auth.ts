import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../prisma';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  console.log('[REGISTER]', req.body);
  const { email, password, role = 'educator' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email/password' });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'Exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, role } });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

authRouter.post('/login', async (req, res) => {
  console.log('[LOGIN]', req.body);
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email/password' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

authRouter.post('/guest', async (_req, res) => {
  // Create ephemeral guest
  const rand = crypto.randomUUID().slice(0,8);
  const email = `guest_${rand}@example.com`;
  const pwdPlain = crypto.randomBytes(6).toString('hex');
  const hash = await bcrypt.hash(pwdPlain, 10);
  const user = await prisma.user.create({ data: { email, password: hash, role: 'guest' } });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '6h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role }, credentials: { email, password: pwdPlain } });
});