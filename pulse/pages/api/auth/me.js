import { clearTokenCookie, parseTokenCookie, verifyToken } from '../../../pulse/lib/auth';
import prisma from '../../../pulse/lib/prisma';

export default async function handler(req, res){
  if (req.method === 'POST'){
    clearTokenCookie(res);
    return res.json({ ok: true });
  }
  if (req.method === 'GET'){
    // return current user
    const token = parseTokenCookie(req);
    if (!token) return res.status(401).json({ user: null });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ user: null });
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ user: null });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
