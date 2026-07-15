# 🏟️ Sistema de Agendamento de Quadras Esportivas

Aplicação web para cadastro de jogadores e quadras, reserva de horários e
consulta da agenda, evitando conflitos de horário na mesma quadra.

Projeto do bootcamp **Desenvolvimento Full Stack - 2026.2 (Atlântico Avanti)**.

## 🎯 Objetivo

Substituir a reserva desorganizada (cadernos, grupos de mensagem, ordem de
chegada) por um sistema que gerencia jogadores, quadras e reservas, impedindo
sobreposição de horários.

## 🛠️ Tecnologias

- **Node.js + Express** — servidor e rotas da API
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL** — banco de dados relacional
- **ReactJS** — interface (frontend)

## 🚀 Como executar (backend)

1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências:
```bash
   npm install
```
3. Crie um arquivo `.env` na raiz (use o `.env.example` como base).
4. Inicie o servidor em modo desenvolvimento:
```bash
   npm run dev
```
5. A API sobe em `http://localhost:3000`.

> ⚠️ As etapas de banco de dados (Prisma + PostgreSQL) serão adicionadas aqui
> conforme o projeto avança.
