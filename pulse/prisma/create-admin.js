#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

function parseArg(name){
  const match = process.argv.find(a => a.startsWith(`--${name}=`));
  if (match) return match.split('=')[1];
  return process.env[name.toUpperCase()];
}

async function main(){
  const email = parseArg('email');
  const password = parseArg('password');
  const name = parseArg('name') || 'Admin (Faustino)';

  if (!email || !password){
    console.error('Uso: node prisma/create-admin.js --email=admin@exemplo --password="SuaSenhaForte" [--name="Nome Admin"]');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  try{
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hash, name },
      create: { name, role: 'admin', email, passwordHash: hash }
    });
    console.log('Admin criado/atualizado:', user.email);
    console.log('Importante: remova/alterar credenciais seed em produção.');
  }catch(e){
    console.error('Erro ao criar admin:', e);
    process.exit(1);
  }finally{
    await prisma.$disconnect();
  }
}

main();
