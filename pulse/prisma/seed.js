const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main(){
  console.log('Seeding database...');
  // admin: email + password; employees: pin
  const admin = { name: 'Admin (Faustino)', role: 'admin', email: 'admin@faustino.local', password: 'Admin@Faustino1' };
  const employees = [
    { name: 'Funcionario A', role: 'employee', pin: '1234' },
    { name: 'Funcionario B', role: 'employee', pin: '4321' }
  ];

  // upsert admin
  const adminHash = await bcrypt.hash(admin.password, 10);
  await prisma.user.upsert({
    where: { email: admin.email },
    update: { passwordHash: adminHash, name: admin.name },
    create: { name: admin.name, role: admin.role, email: admin.email, passwordHash: adminHash }
  });

  for (const u of employees){
    const hash = await bcrypt.hash(u.pin, 10);
    await prisma.user.upsert({
      where: { name: u.name },
      update: { pinHash: hash },
      create: { name: u.name, role: u.role, pinHash: hash }
    });
  }

  console.log('Seed completo. Admin:', admin.email, 'senha:', admin.password);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
