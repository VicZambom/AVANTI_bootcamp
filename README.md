# 🏟️ RUFFO — Sistema de Agendamento de Quadras Esportivas

Aplicação web para gerenciar quadras, jogadores e reservas de horários,
evitando conflitos de agendamento na mesma quadra.

Projeto do bootcamp **Desenvolvimento Full Stack Básico — DFS-2026.2 (Atlântico Avanti)**.

---

## 🌐 Aplicação no ar

| | |
|---|---|
| **Site** | https://ruffo.netlify.app/|
| **API** | https://avanti-bootcamp.onrender.com |

> ⏱️ A API está hospedada em plano gratuito e hiberna após 15 minutos sem uso.
> O primeiro acesso pode levar cerca de 1 minuto para responder — depois disso
> a navegação fica normal.

**Acesso à área do gestor:**
- E-mail: `gerente@ruffo.com`
- Senha: `123456`

---

## 🎯 Objetivo

Em muitas quadras de bairro, escolas e condomínios, a reserva de horários é feita
em cadernos, grupos de mensagem ou por ordem de chegada — o que gera conflitos e
dificulta enxergar a disponibilidade.

O RUFFO substitui esse processo por um sistema que cadastra quadras e jogadores,
registra reservas e **bloqueia automaticamente horários sobrepostos** na mesma quadra.

O sistema tem duas frentes:

- **Landing page pública** — o cliente vê os horários livres de todas as quadras e
  solicita sua reserva sem precisar de cadastro prévio.
- **Painel do gestor** — área autenticada para administrar quadras, jogadores e a
  agenda completa.

---

## 🛠️ Tecnologias

**Backend**
- Node.js + Express — servidor e rotas da API
- Prisma ORM 7 — acesso ao banco de dados
- PostgreSQL (Neon) — banco de dados relacional
- bcryptjs — criptografia de senhas
- jsonwebtoken — autenticação por token

**Frontend**
- ReactJS + Vite
- React Router DOM — navegação e rotas protegidas
- lucide-react — ícones

**Infraestrutura**
- Render — hospedagem da API
- Netlify — hospedagem do frontend

---

## ✅ Funcionalidades

### Backend
- CRUD completo de Jogadores, Quadras e Reservas
- Validação de conflito de horário na mesma quadra
- Cancelamento lógico de reservas (preserva o histórico)
- Autenticação com JWT e senha criptografada
- Rotas de leitura públicas; rotas de escrita protegidas por token
- Endpoint público de solicitação de reserva com transação atômica
- Filtros de reservas por quadra e por data

### Frontend
- **Landing page** — grade panorâmica de horários por quadra, com formulário de
  reserva e tela de confirmação
- **Login** — autenticação integrada à API
- **Agenda** — calendário mensal com painel do dia, criação, edição e cancelamento
  de reservas, e visualização dos horários já ocupados
- **Jogadores** — listagem com estatísticas de reservas, cadastro, edição e exclusão
- **Quadras** — cards com status de ocupação em tempo real e CRUD completo
- Busca em todas as telas de listagem
- Layout responsivo, pensado para uso em celular

---

## 🚀 Como executar localmente

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

Crie um arquivo `.env` dentro de `Back-end/`, usando o `.env.example` como base:

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
```

Crie um arquivo `.env` dentro de `front-end/`, usando o `.env.example` como base:

```
VITE_API_URL=http://localhost:3000
```

Inicie a aplicação:

```bash
npm run dev
```

Abre em `http://localhost:5173`.

> ⚠️ O backend precisa estar rodando para o frontend funcionar.

---

## 📍 Rotas da API

| Recurso | Método | Rota | Autenticação |
|---|---|---|---|
| Login | POST | `/auth/login` | — |
| Jogadores | GET | `/jogadores`, `/jogadores/:id` | não |
| Jogadores | POST / PUT / DELETE | `/jogadores`, `/jogadores/:id` | **sim** |
| Quadras | GET | `/quadras`, `/quadras/:id` | não |
| Quadras | POST / PUT / DELETE | `/quadras`, `/quadras/:id` | **sim** |
| Reservas | GET | `/reservas`, `/reservas/:id` | não |
| Reservas | POST | `/reservas` | não |
| Reservas | POST | `/reservas/solicitacao` | não |
| Reservas | PUT / DELETE | `/reservas/:id` | **sim** |

**Filtros disponíveis em `GET /reservas`:**
`?quadraId=1` · `?data=2026-08-20` · `?incluirCanceladas=true`

---

## 🗄️ Estrutura do banco

| Tabela | Campos |
|---|---|
| `Usuario` | id, nome, email, senha, criadoEm |
| `Jogador` | id, nome, email, telefone, criadoEm |
| `Quadra` | id, nome, modalidade, localizacao, criadoEm |
| `Reserva` | id, inicio, fim, status, observacao, jogadorId, quadraId, criadoEm, atualizadoEm |

**Enums:** `Modalidade` (FUTEBOL, FUTSAL, VOLEI, BASQUETE, TENIS, HANDEBOL, OUTRO)
e `StatusReserva` (ATIVA, CANCELADA).

---

## 🧠 Decisões de projeto

**Datas como `DateTime` completo, em vez de data + hora separadas.**
Guardar `inicio` e `fim` como timestamps torna a consulta de sobreposição direta,
sem precisar combinar campos.

**Detecção de conflito com operadores estritos.**
Duas reservas conflitam quando `existente.inicio < nova.fim` **e**
`existente.fim > nova.inicio`. Horários que apenas se encostam — como 18h–19h e
19h–20h — não conflitam.

**Cancelamento lógico.**
O `DELETE /reservas/:id` marca a reserva como `CANCELADA` em vez de apagá-la.
O histórico é preservado e o horário volta a ficar disponível.

**`Usuario` separado de `Jogador`.**
Quem opera o sistema não é quem usa a quadra. Misturar as duas entidades
complicaria a autenticação sem ganho.

**Solicitação pública em transação.**
O endpoint `POST /reservas/solicitacao` cria ou atualiza o jogador e cria a
reserva numa única transação. Se houver conflito de horário, nada é gravado —
evitando jogadores órfãos no banco.

**Fuso horário.**
O banco armazena datas em UTC. A conversão para o horário local acontece no
frontend, usando as APIs nativas do JavaScript.

---

## 👥 Equipe

| Integrante | Contribuição |
|---|---|
| Talita | Dev Fullstack |
| Victoria | Dev Fullstack |
