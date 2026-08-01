# Haver — Pulse (Ponto)

Este diretório adiciona um scaffold básico de backend usando Next.js + Prisma.

Características:
- Prisma ORM (schema em prisma/schema.prisma)
- Endpoint POST /api/punch para bater ponto via PIN de 4 dígitos (compara hashes)
- Endpoint GET /api/punches para listar registros (filtros por userId/from/to)
- Script de seed que cria 3 contas de exemplo (admin + 2 funcionários)

Como testar localmente

1) Instale dependências:

```bash
cd pulse
npm install
```

2) Gerar o banco de dados (SQLite por padrão) e executar migração:

```bash
npx prisma migrate dev --name init
npm run seed
```

3) Iniciar o app Next.js:

```bash
npm run dev
```

4) A interface inicial está em pulse/index.html (estática) — embora você possa integrar a UI ao Next.js, por ora continue usando essa página estática para testar o fluxo.

Endpoints
- POST /api/punch  { pin: '1234' }  -> cria um registro se o PIN existir (retorna 201)
- GET /api/punches -> lista todos os registros (aceita query params userId, from, to)

Contas de exemplo (seed):
- Admin (name: "Admin (Faustino)") — PIN: 9999
- Funcionario A — PIN: 1234
- Funcionario B — PIN: 4321

Notas e próximos passos
- Atualmente o banco usado em desenvolvimento é SQLite. Para produção troque DATABASE_URL para uma conexão Postgres.
- Para melhorar segurança, implemente autenticação baseada em tokens/sessions para admin e endpoints protegidos.
- Próximo passo: integrar a UI (pulse/index.html) com o endpoint /api/punch, implementar painel admin, e migrar para Postgres.
