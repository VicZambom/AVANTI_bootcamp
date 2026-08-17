# 🏟️ RUFFO — Sistema de Agendamento de Quadras Esportivas

Aplicação web para gerenciar quadras, jogadores e reservas de horários,
evitando conflitos de agendamento na mesma quadra.

Projeto do bootcamp **Desenvolvimento Full Stack Básico — DFS-2026.2 (Atlântico Avanti)**.

---

## 🎯 Objetivo

Em muitas quadras de bairro, escolas e condomínios a reserva de horários é feita
em cadernos, grupos de mensagem ou por ordem de chegada — o que gera conflitos e
dificulta enxergar a disponibilidade.

O RUFFO substitui esse processo por um sistema que cadastra quadras e jogadores,
registra reservas e **bloqueia automaticamente horários sobrepostos** na mesma quadra.

---

## 🛠️ Tecnologias

**Backend**
- Node.js + Express — servidor e rotas da API
- Prisma ORM 7 — acesso ao banco de dados
- PostgreSQL (Neon) — banco de dados relacional
- bcryptjs + jsonwebtoken — autenticação

**Frontend**
- ReactJS + Vite
- React Router DOM — navegação e rotas protegidas
- lucide-react — ícones

---

## ✅ Funcionalidades

**Backend**
- CRUD completo de Jogadores, Quadras e Reservas
- Validação de conflito de horário na mesma quadra
- Cancelamento lógico de reservas (preserva o histórico)
- Autenticação com JWT e senha criptografada
- Rotas de leitura públicas; rotas de escrita protegidas por token
- Filtros de reservas por quadra e por data

**Frontend**
- Tela de login integrada à API
- Agenda mensal com painel do dia selecionado
- Criação, edição e cancelamento de reservas
- Visualização de horários ocupados e disponíveis
- Busca por nome, e-mail, telefone ou quadra
- Tela de jogadores
- Landing page pública

---

## 🚀 Como executar

### Pré-requisitos
- Node.js 18 ou superior
- Uma base PostgreSQL (recomendamos o [Neon](https://neon.tech), gratuito)

### 1. Clone o repositório

```bash
git clone https://github.com/VicZambom/AVANTI_bootcamp.git
cd AVANTI_bootcamp
```

### 2. Backend

```bash
cd Back-end
npm install
```

Crie um arquivo `.env` dentro de `Back-end/` com:

```
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
JWT_SECRET="uma-frase-longa-e-aleatoria-de-sua-escolha"
```

Gere o cliente do Prisma e crie as tabelas:

```bash
npx prisma generate
npx prisma migrate dev
```

Crie o usuário gestor inicial:

```bash
node prisma/seed.js
```

Inicie o servidor:

```bash
npm run dev
```

A API sobe em `http://localhost:3000`.

### 3. Frontend

Em **outro terminal**, a partir da raiz do projeto:

```bash
cd front-end
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

> ⚠️ O backend precisa estar rodando para o frontend funcionar.

### 4. Acesso

Use as credenciais criadas pelo seed (exibidas no terminal ao rodá-lo).

---

## 📍 Rotas da API

| Recurso | Método | Rota | Autenticação |
|---|---|---|---|
| Login | POST | `/auth/login` | — |
| Jogadores | GET | `/jogadores`, `/jogadores/:id` | não |
| Jogadores | POST / PUT / DELETE | `/jogadores` | **sim** |
| Quadras | GET | `/quadras`, `/quadras/:id` | não |
| Quadras | POST / PUT / DELETE | `/quadras` | **sim** |
| Reservas | GET | `/reservas`, `/reservas/:id` | não |
| Reservas | POST | `/reservas` | não |
| Reservas | PUT / DELETE | `/reservas/:id` | **sim** |

**Filtros de reservas:** `?quadraId=1`, `?data=2026-08-20`, `?incluirCanceladas=true`

---

## 🧠 Decisões de projeto

- **Cancelamento lógico:** o `DELETE /reservas/:id` marca a reserva como
  `CANCELADA` em vez de apagá-la, preservando o histórico. Reservas canceladas
  não bloqueiam horários.
- **Detecção de conflito:** duas reservas conflitam quando
  `existente.inicio < nova.fim` **e** `existente.fim > nova.inicio`.
  Horários que apenas se encostam (18h–19h e 19h–20h) não conflitam.
- **`POST /reservas` é público:** permite que visitantes solicitem reservas
  pela landing page sem precisar de login.
- **Fuso horário:** o banco armazena datas em UTC; a conversão para o horário
  local acontece no frontend.

---

