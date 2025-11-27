import jwt from 'jsonwebtoken';
export function auth(req, res, next) {
    const h = req.headers.authorization;
    if (!h || !h.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing token' });
    try {
        const decoded = jwt.verify(h.slice(7), process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
export function requireEducator(req, res, next) {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthenticated' });
    if (req.user.role !== 'educator')
        return res.status(403).json({ error: 'Forbidden' });
    next();
}
