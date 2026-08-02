import bcrypt from 'bcryptjs';
import prisma from '../../pulse/lib/prisma';
import { signToken, setTokenCookie } from '../../pulse/lib/auth';

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try{
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });
    const token = signToken({ userId: user.id, role: user.role, name: user.name });
    setTokenCookie(res, token);
    return res.status(200).json({ ok: true, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  }catch(e){ console.error(e); return res.status(500).json({ error: 'internal' }); }
}
