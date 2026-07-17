-- CreateEnum
CREATE TYPE "Modalidade" AS ENUM (
    'FUTEBOL', 
    'FUTSAL', 
    'VOLEI', 
    'BASQUETE', 
    'TENIS', 
    'HANDEBOL', 
    'OUTRO'
);

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM (
    'ATIVA', 
    'CANCELADA'
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quadra" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "modalidade" "Modalidade" NOT NULL,
    "localizacao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quadra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "status" "StatusReserva" NOT NULL DEFAULT 'ATIVA',
    "observacao" TEXT,
    "jogadorId" INTEGER NOT NULL,
    "quadraId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jogador_email_key" 
ON "Jogador"("email");

-- CreateIndex
CREATE INDEX "Reserva_quadraId_inicio_fim_idx" 
ON "Reserva"("quadraId", "inicio", "fim");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_jogadorId_fkey" 
FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_quadraId_fkey" 
FOREIGN KEY ("quadraId") REFERENCES "Quadra"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;
