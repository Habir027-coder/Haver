const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main(){
  console.log('Seeding database...');
  // admin: pin 9999, employees: 1234, 4321
  const users = [
    { name: 'Admin (Faustino)', role: 'admin', pin: '9999' },
    { name: 'Funcionario A', role: 'employee', pin: '1234' },
    { name: 'Funcionario B', role: 'employee', pin: '4321' }
  ];

  for (const u of users){
    const hash = await bcrypt.hash(u.pin, 10);
    await prisma.user.upsert({
      where: { name: u.name },
      update: { pinHash: hash },
      create: { name: u.name, role: u.role, pinHash: hash }
    });
  }

  console.log('Seed completo.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
