# Jarvis — Sol.IA

> **Este repositório NÃO está vazio.**  
> Ele contém um projeto full-stack completo de assistente de inteligência artificial pessoal, chamado **Sol.IA** / Jarvis.

---

## Visão Geral

**Sol.IA** é uma plataforma de IA pessoal com motor cognitivo central, memória persistente e múltiplos agentes especializados. O objetivo é ser um assistente inteligente capaz de aprender com o usuário ao longo do tempo, processar documentos, analisar padrões de comportamento e oferecer suporte em áreas como produtividade, marketing, editorial e bem-estar mental.

---

## Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion |
| **Backend** | Node.js, Express, tRPC, TypeScript |
| **Banco de Dados** | Supabase (MySQL via Drizzle ORM) |
| **IA / LLM** | Integração com LLMs via `server/_core/llm.ts` |
| **Autenticação** | OAuth, cookies seguros (`server/_core/oauth.ts`) |
| **Armazenamento** | AWS S3 (`@aws-sdk/client-s3`) |
| **Testes** | Vitest |
| **Gerenciador de Pacotes** | pnpm |

---

## Estrutura do Projeto

```
Jarvis-Sol.IA/
├── client/                  # Frontend React
│   ├── index.html
│   └── src/
│       ├── components/      # Componentes de UI (shadcn/ui + customizados)
│       └── ...
├── server/                  # Backend Express + tRPC
│   ├── _core/               # Núcleo do servidor (LLM, OAuth, Storage, etc.)
│   ├── routers/             # Rotas tRPC (chat, etc.)
│   ├── cognitive-engine.ts  # Motor cognitivo central
│   ├── db.ts                # Schema do banco de dados (Drizzle)
│   └── storage.ts           # Gerenciamento de arquivos
├── shared/                  # Tipos e constantes compartilhados
│   ├── types.ts
│   └── const.ts
├── drizzle/                 # Migrations do banco de dados
├── patches/                 # Patches de dependências
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── drizzle.config.ts
└── todo.md                  # Roadmap detalhado do projeto
```

---

## Como Executar

### Pré-requisitos

- Node.js 20+
- pnpm 10+
- Banco de dados compatível (Supabase / MySQL)

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

### Build de Produção

```bash
pnpm build
pnpm start
```

### Banco de Dados

```bash
pnpm db:push
```

### Testes

```bash
pnpm test
```

### Formatação

```bash
pnpm format
```

---

## Roadmap

O progresso detalhado do projeto está documentado em [`todo.md`](./todo.md), dividido em 10 fases:

1. **Fase 1** — Arquitetura e Planejamento
2. **Fase 2** — Motor Cognitivo Central e Sistema de Memória ✅
3. **Fase 3** — Interface de Chat em Tempo Real ✅
4. **Fase 4** — Ingestão de PDFs e Google Drive
5. **Fase 5** — Agente Assessor Pessoal
6. **Fase 6** — Agente Psicanalista/Psicólogo
7. **Fase 7** — Agente Estrategista de Marketing
8. **Fase 8** — Agente Estrategista Editorial
9. **Fase 9** — Dashboard de Gerenciamento
10. **Fase 10** — Testes, Otimizações e Entrega

---

## Licença

MIT
