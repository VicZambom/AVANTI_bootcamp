import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// Listar todas as reservas 
router.get("/", async (req, res) => {
  const reservas = await prisma.reserva.findMany();
  res.json(reservas);
});

// Buscar reserva por id
router.get("/:id", async (req, res) => {
  const reserva = await prisma.reserva.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!reserva) {
    return res.status(404).json({ mensagem: "Reserva não encontrada" });
  }

  res.json(reserva);
});

// Criar reserva
router.post("/", async (req, res) => {
  const { jogadorId, quadraId, inicio, fim, observacao } = req.body;

  // converte uma vez, usa nos dois lugares
  const inicioData = new Date(inicio);
  const fimData = new Date(fim);

  const conflito = await prisma.reserva.findFirst({
    where: {
      quadraId: Number(quadraId),
      inicio: { lt: fimData },
      fim: { gt: inicioData },
    },
  });

  if (conflito) {
    return res.status(409).json({ mensagem: "Já existe uma reserva nesse horário para esta quadra" });
  }

  const reserva = await prisma.reserva.create({
    data: {
      jogadorId: Number(jogadorId),
      quadraId: Number(quadraId),
      inicio: inicioData,
      fim: fimData,
      observacao: observacao || null,
    },
  });

  res.status(201).json(reserva);
});

// Atualizar reserva
router.put("/:id", async (req, res) => {
  const { jogadorId, quadraId, inicio, fim, observacao } = req.body;
  const id = Number(req.params.id);

  const inicioData = new Date(inicio);
  const fimData = new Date(fim);

  const conflito = await prisma.reserva.findFirst({
    where: {
      id: { not: id },
      quadraId: Number(quadraId),
      inicio: { lt: fimData },
      fim: { gt: inicioData },
    },
  });

  if (conflito) {
    return res.status(409).json({ mensagem: "Já existe uma reserva nesse horário para esta quadra" });
  }

  const reserva = await prisma.reserva.update({
    where: { id },
    data: {
      jogadorId: Number(jogadorId),
      quadraId: Number(quadraId),
      inicio: inicioData,
      fim: fimData,
      observacao: observacao || null,
    },
  });

  res.json(reserva);
});

// Excluir reserva
router.delete("/:id", async (req, res) => {
  await prisma.reserva.delete({
    where: { id: Number(req.params.id) }
  });

  res.json({ mensagem: "Reserva excluída com sucesso!" });
});

export default router;