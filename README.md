# PróSiga Frontend

Sistema de Gerenciamento Acadêmico - Interface Web

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Selenium WebDriver** - Testes E2E
- **Jest** - Framework de testes

## 📋 Pré-requisitos

- Node.js 18+ (recomendado: Node.js 20+)
- npm ou pnpm
- Chrome/Chromium (para testes Selenium)

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_AUTH_URL=http://localhost:9000
```

Para produção (Vercel):
```env
NEXT_PUBLIC_API_BACKEND_URL=https://prosiga-backend.onrender.com
NEXT_PUBLIC_API_AUTH_URL=https://prosiga-login.onrender.com
```

## 🏃 Executando o projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Build de produção

```bash
npm run build
npm start
```

## 🧪 Testes

### Testes E2E com Selenium

Os testes utilizam Selenium WebDriver para automatizar o navegador Chrome e testar a aplicação.

**Rodar todos os testes E2E:**
```bash
npm run test:e2e
```

**Rodar testes em modo watch:**
```bash
npm run test:watch
```

**Rodar teste específico:**
```bash
npm test tests/e2e/login.test.ts
```

### Configuração dos testes

- **Ambiente de teste**: Por padrão, os testes rodam contra produção (`https://prosiga-frontend.vercel.app`)
- **Modo visual**: O navegador Chrome abre durante os testes para você acompanhar
- **Credenciais de teste**: `bruno@email.com` / `teste-bruno`

Para alterar a URL de teste, edite `tests/setup.ts`:

```typescript
// Testar localmente
testSetup = new TestSetup('http://localhost:3000')

// Testar em produção
testSetup = new TestSetup('https://prosiga-frontend.vercel.app')
```

### Estrutura dos testes

```
tests/
├── setup.ts                    # Configuração do Selenium
├── e2e/
│   ├── login.test.ts          # Testes de autenticação
│   └── navigation.test.ts     # Testes de navegação
└── README.md                   # Documentação detalhada
```

## 🎨 Recursos

### Acessibilidade

- **VLibras**: Widget de tradução para Libras (Língua Brasileira de Sinais)
- Aparece automaticamente no canto inferior direito
- Traduz conteúdo da página em tempo real

### Funcionalidades

#### Para Alunos
- Consultar turmas matriculadas
- Visualizar notas e faltas
- Fazer matrícula em disciplinas
- Consultar avisos

#### Para Professores
- Gerenciar turmas
- Lançar notas e faltas
- Visualizar lista de alunos
- Publicar avisos

#### Para Coordenadores (Admin)
- Gerenciar usuários (upload em lote via CSV)
- Criar e gerenciar períodos letivos
- Criar e gerenciar turmas
- Gerenciar cursos e disciplinas
- Gerar relatórios
- Publicar avisos gerais

## 📁 Estrutura do projeto

```
prosiga-front/
├── app/                       # Páginas Next.js (App Router)
│   ├── admin/                # Páginas administrativas
│   ├── auth/                 # Registro de usuário
│   ├── dashboard/            # Dashboards (aluno, professor, admin)
│   └── ...
├── components/               # Componentes React
│   ├── admin/               # Componentes administrativos
│   ├── auth/                # Formulários de login/registro
│   ├── dashboard/           # Componentes dos dashboards
│   └── ui/                  # Componentes UI (shadcn)
├── tests/                    # Testes E2E
│   ├── setup.ts
│   └── e2e/
├── lib/                      # Utilitários
└── public/                   # Arquivos estáticos
```

## 🌐 Deploy

### Vercel (Produção)

O projeto está configurado para deploy automático na Vercel:

1. Push para o branch `main` faz deploy em produção
2. Pull requests criam preview deployments automaticamente

**URL de produção**: https://prosiga-frontend.vercel.app

### Variáveis de ambiente na Vercel

Configure no painel da Vercel:
- `NEXT_PUBLIC_API_BACKEND_URL`
- `NEXT_PUBLIC_API_AUTH_URL`

## 🔗 Serviços relacionados

- **Backend Principal**: [back-prosiga](../back-prosiga) - FastAPI
- **Serviço de Autenticação**: [prosiga-login](../prosiga-login) - FastAPI
- **Banco de Dados**: PostgreSQL (Render)

## 📝 Fluxo de autenticação

1. Usuário faz primeiro acesso com CPF (pré-cadastrado pelo admin)
2. Define email e senha
3. Conta é ativada (status: NOVO → ATIVO)
4. Login com email e senha
5. Token JWT armazenado no localStorage
6. Redirecionamento baseado no tipo de usuário

## 🐛 Debugging

### Problemas comuns

**Erro de CORS:**
- Verifique se os backends estão configurados para aceitar requisições do frontend
- Backend deve ter `allow_origin_regex` configurado

**Erro 401 Unauthorized:**
- Verifique se os backends estão rodando
- Confirme as URLs nas variáveis de ambiente
- Verifique se o usuário está com status ATIVO

**Testes Selenium falhando:**
- Certifique-se de que o ChromeDriver é compatível com sua versão do Chrome
- Verifique se a URL de teste está acessível
- Confirme as credenciais de teste no código

## 📄 Licença

Este projeto é parte do sistema acadêmico PróSiga.
