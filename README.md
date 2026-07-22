# 🏟️ Sistema de Agendamento de Quadras Esportivas

Aplicação web para cadastro de jogadores e quadras, reserva de horários e
consulta da agenda, evitando conflitos de horário na mesma quadra.

Projeto do bootcamp **Desenvolvimento Full Stack - 2026.2 (Atlântico Avanti)**.

## 🎯 Objetivo

Substituir a reserva desorganizada (cadernos, grupos de mensagem, ordem de
chegada) por um sistema que gerencia jogadores, quadras e reservas, impedindo
sobreposição de horários na mesma quadra.

## 🛠️ Tecnologias

- **Node.js + Express** — servidor e rotas da API
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL** — banco de dados relacional (hospedado no Neon)
- **ReactJS** — interface (frontend, em desenvolvimento)

## ✅ Funcionalidades do backend

- CRUD de **Jogadores** (criar, listar, buscar, atualizar, remover)
- CRUD de **Quadras** (criar, listar, buscar, atualizar, remover)
- CRUD de **Reservas** com **validação de conflito de horário**:
  não permite duas reservas sobrepostas na mesma quadra.

## 🚀 Como executar (backend)

1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências:
```bash
   npm install
```
3. Crie um arquivo `.env` na raiz (use o `.env.example` como base) com a sua
   conexão do PostgreSQL:
```bash
   DATABASE_URL="postgresql://usuario:senha@host:5432/banco?sslmode=require"
```
4. Gere o cliente do Prisma e crie as tabelas:
```bash
   npx prisma generate
   npx prisma migrate dev
```
5. Inicie o servidor em modo desenvolvimento:
```bash
   npm run dev
```
6. A API sobe em `http://localhost:3000`.

## 📍 Rotas principais

| Recurso   | Método | Rota              |
|-----------|--------|-------------------|
| Jogadores | GET/POST/PUT/DELETE | `/jogadores` |
| Quadras   | GET/POST/PUT/DELETE | `/quadras`   |
| Reservas  | GET/POST/PUT/DELETE | `/reservas`  |
