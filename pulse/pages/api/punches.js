import prisma from '../../pulse/lib/prisma';

export default async function handler(req, res){
  // GET: list punches (admin) - accepts ?userId=&from=&to=
  if (req.method === 'GET'){
    const { userId, from, to } = req.query;
    const where = {};
    if (userId) where.userId = Number(userId);
    if (from || to){
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from);
      if (to) where.timestamp.lte = new Date(to);
    }
    try{
      const punches = await prisma.punch.findMany({ where, include: { user: true }, orderBy: { timestamp: 'desc' } });
      return res.status(200).json({ punches });
    }catch(e){ console.error(e); return res.status(500).json({ error: 'erro' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
