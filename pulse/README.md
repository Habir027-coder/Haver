## Observação importante sobre criação do administrador

Por segurança, o seed padrão NÃO cria mais um usuário administrador com senha fixa.

Como criar o primeiro usuário administrador (recomendado)

1) Defina as variáveis de ambiente (opcional) ou passe via argumentos:
   - ADMIN_EMAIL e ADMIN_PASSWORD podem ser exportadas ou você pode usar argumentos no comando.

2) Execute o script `create-admin` na pasta pulse:

```bash
cd pulse
# opção A: passar via argumentos
node prisma/create-admin.js --email=admin@seudominio --password="SenhaForteAqui" --name="Admin (Faustino)"
# opção B: usando variáveis de ambiente
export ADMIN_EMAIL=admin@seudominio
export ADMIN_PASSWORD="SenhaForteAqui"
node prisma/create-admin.js --email=$ADMIN_EMAIL --password=$ADMIN_PASSWORD --name="Admin (Faustino)"
```

3) Após criar o admin, altere imediatamente a senha para uma mais segura se necessário e remova qualquer documentação de senhas em claro.

Observação sobre seed
- O comando `npm run seed` continua a popular apenas os usuários funcionários (PINs de teste). Ele não cria o admin por padrão para evitar credenciais em repositórios.

Se preferir que eu execute a criação do admin no ambiente de produção, forneça a string DATABASE_URL e as credenciais desejadas, ou execute o comando acima no servidor/console do provedor.
