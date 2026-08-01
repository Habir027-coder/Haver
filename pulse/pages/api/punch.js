import bcrypt from 'bcryptjs';
import prisma from '../../pulse/lib/prisma';

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { pin } = req.body;
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)){
    return res.status(400).json({ error: 'PIN inválido' });
  }
  try{
    // find user by pin (compare hashes)
    const users = await prisma.user.findMany();
    let found = null;
    for (const u of users){
      const match = await bcrypt.compare(pin, u.pinHash);
      if (match){ found = u; break; }
    }
    if (!found) return res.status(401).json({ error: 'PIN não reconhecido' });

    const punch = await prisma.punch.create({ data: { userId: found.id, type: 'Ponto' } });
    return res.status(201).json({ ok: true, punch });
  }catch(e){
    console.error(e);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
