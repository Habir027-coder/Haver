DEPLOY — instruções rápidas

Este arquivo explica como fazer deploy do app Pulse (pasta `pulse/`) em Vercel com uma base Postgres gerenciada.

Opção A — Conectar diretamente o repositório ao Vercel (recomendado)
1) Acesse https://vercel.com e crie um projeto novo a partir do seu repositório GitHub (repo `Habir027-coder/Haver`).
2) Ao configurar o projeto, defina como diretório do projeto: `pulse` (importante — o Next app está nessa pasta).
3) Nas configurações do projeto no Vercel -> Environment Variables, adicione as seguintes variáveis:
   - DATABASE_URL = postgresql://USER:PASSWORD@HOST:5432/DBNAME
   - JWT_SECRET = (valor forte)
   - NODE_ENV = production
4) Se usar Postgres gerenciado (Supabase, Railway, Heroku, Neon etc.), obtenha a string DATABASE_URL e cole nas variáveis do Vercel.
5) Desencadeie um deploy (push para main) ou clique 'Deploy' no painel do Vercel.

Opção B — Usar GitHub Actions (CI) para deploy via Vercel CLI
- Existe um workflow de exemplo em `.github/workflows/deploy-to-vercel.yml` que usa o token do Vercel.
- Você precisa adicionar os seguintes Secrets no repositório (Settings -> Secrets -> Actions):
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_PROJECT_ID
  - DATABASE_URL
  - JWT_SECRET

Observações sobre migrações
- Em produção execute:
  - npx prisma migrate deploy
- No deploy automatizado você pode adicionar um passo para executar as migrações contra a DATABASE_URL, mas tenha cuidado:
  - backup do DB antes de migrar
  - não execute automaticamente em DBs de produção sem revisão

Recomendações de segurança
- Use um JWT_SECRET forte e guarde-o como secret no Vercel.
- Force HTTPS no painel do provedor (Vercel já usa HTTPS por padrão).
- Revise as credenciais seed (remova/atualize a senha padrão do admin em produção).

Exemplo rápido com Docker Postgres (local)
To test locally you can run a Postgres container:

```bash
docker run --name haver-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=haver -p 5432:5432 -d postgres:15
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/haver"
export JWT_SECRET="troque_para_um_valor_forte"
cd pulse
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```
