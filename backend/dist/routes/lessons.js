import { Router } from 'express';
import { prisma } from '../prisma.js';
import { auth } from '../middleware/auth.js';
export const lessonsRouter = Router();
// Public list
lessonsRouter.get('/', async (_req, res) => {
    const lessons = await prisma.lesson.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(lessons);
});
// Public get by id
lessonsRouter.get('/:id', async (req, res) => {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson)
        return res.status(404).json({ error: 'Not found' });
    res.json(lesson);
});
// Create (educator only)
lessonsRouter.post('/', auth, async (req, res) => {
    if (req.user.role !== 'educator')
        return res.status(403).json({ error: 'Educator only' });
    const { title, description } = req.body;
    if (!title)
        return res.status(400).json({ error: 'Missing title' });
    const lesson = await prisma.lesson.create({ data: { title, description: description ?? null, ownerId: req.user.id } });
    res.json(lesson);
});
// Delete (educator owns)
lessonsRouter.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'educator')
        return res.status(403).json({ error: 'Educator only' });
    const { id } = req.params;
    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson)
        return res.status(404).json({ error: 'Not found' });
    if (lesson.ownerId !== req.user.id)
        return res.status(403).json({ error: 'Not owner' });
    await prisma.lesson.delete({ where: { id } });
    res.json({ deleted: true });
});
