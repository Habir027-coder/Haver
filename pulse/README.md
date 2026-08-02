# Haver — Pulse (Ponto)

Este diretório adiciona um scaffold básico de backend usando Next.js + Prisma.

Atualização: Migração para Postgres (opcional para produção)

Este projeto pode usar um banco Postgres em produção. Abaixo estão as instruções para configurar o DATABASE_URL, rodar as migrações e o seed.

Variáveis de ambiente necessárias
- DATABASE_URL: string de conexão com Postgres (ex: postgres://USER:PASS@HOST:5432/DBNAME)
- JWT_SECRET: segredo para assinar tokens JWT
- NODE_ENV: environment (development / production)

Exemplo de .env (veja pulse/.env.example)

Instalação e execução local (desenvolvimento)

1) Instale dependências:

```bash
cd pulse
npm install
```

2) Configure suas variáveis de ambiente. Você pode criar um arquivo `.env` na pasta pulse com as chaves (DATABASE_URL, JWT_SECRET, NODE_ENV). Para desenvolvimento rápido, crie um Postgres local (Docker) ou aponte para sua base.

Exemplo Docker (Postgres rápido):

```bash
docker run --name haver-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=haver -p 5432:5432 -d postgres:15
# Depois use DATABASE_URL=postgresql://postgres:postgres@localhost:5432/haver
```

3) Rodar migrações e seed (desenvolvimento):

```bash
# cria/migra o banco e gera client
npx prisma migrate dev --name init
# popula dados iniciais
npm run seed
```

Em ambiente de produção (CI/CD) use:

```bash
npx prisma migrate deploy
npm run seed
```

Observações sobre SQLite (fallback de desenvolvimento)
- O schema.prisma atual está configurado para Postgres (provider = "postgresql").
- Se você preferir usar SQLite para testes rápidos, edite `pulse/prisma/schema.prisma` e altere o bloco `datasource db` para:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL", "file:./dev.db")
}
```

E então rode:

```bash
npx prisma migrate dev --name init
npm run seed
```

Endpoints disponíveis
- POST /pulse/api/auth/login — autentica admin (email + senha) e seta cookie HttpOnly com JWT
- GET  /pulse/api/auth/me — retorna usuário atual a partir do cookie
- POST /pulse/api/punch — bate ponto via PIN (body: { pin: '1234' })
- GET  /pulse/api/punches — lista registros (opções: ?userId=&from=&to=)

Contas de exemplo (seed)
- Admin
  - email: admin@faustino.local
  - senha: Admin@Faustino1
- Funcionários (PINs)
  - Funcionario A — 1234
  - Funcionario B — 4321

Segurança / recomendações
- Troque imediatamente JWT_SECRET em produção.
- Forçar HTTPS e cookies com secure=true em produção.
- Remover/alterar senhas seed antes de colocar em produção.

Próximos passos recomendados
- Integrar a UI como páginas Next.js (migrar pulse/index.html para uma página React). 
- Implementar gerenciamento de usuários (criar/editar funcionários, reset de senha).
- Implementar cálculo de horas trabalhadas e relatórios por período.
- Fazer deploy em Vercel (frontend) e um serviço de Postgres gerenciado (Heroku, Supabase, Railway, etc.).
