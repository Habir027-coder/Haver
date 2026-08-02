import { parseTokenCookie, verifyToken } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res){
  // middleware: check admin
  const token = parseTokenCookie(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'admin') return res.status(401).json({ error: 'unauthorized' });

  if (req.method === 'GET'){
    try{
      const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
      return res.json({ users });
    }catch(e){ console.error(e); return res.status(500).json({ error: 'internal' }); }
  }

  if (req.method === 'POST'){
    const { name, email, role, password, pin } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    try{
      const data = { name, role: role || 'employee' };
      if (email) data.email = email;
      if (password) data.passwordHash = await bcrypt.hash(password, 10);
      if (pin) data.pinHash = await bcrypt.hash(pin, 10);
      const user = await prisma.user.create({ data });
      return res.status(201).json({ user });
    }catch(e){ console.error(e); return res.status(500).json({ error: 'internal' }); }
  }

  if (req.method === 'DELETE'){
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });
    try{
      await prisma.user.delete({ where: { id: Number(id) } });
      return res.json({ ok: true });
    }catch(e){ console.error(e); return res.status(500).json({ error: 'internal' }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
