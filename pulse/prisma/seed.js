const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main(){
  console.log('Seeding database (apenas funcionários)...');
  // employees: pin
  const employees = [
    { name: 'Funcionario A', role: 'employee', pin: '1234' },
    { name: 'Funcionario B', role: 'employee', pin: '4321' }
  ];

  for (const u of employees){
    const hash = await bcrypt.hash(u.pin, 10);
    await prisma.user.upsert({
      where: { name: u.name },
      update: { pinHash: hash },
      create: { name: u.name, role: u.role, pinHash: hash }
    });
  }

  console.log('Seed completo (funcionários).');
  console.log('Observação: o usuário administrador NÃO é criado por padrão pelo seed.');
  console.log('Crie o admin com: node prisma/create-admin.js --email=admin@exemplo --password="SuaSenhaForte"');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
