import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// Listar todas as reservas
router.get("/", async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany();

    return res.status(200).json(reservas);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar as reservas.",
    });
  }
});

// Buscar reserva por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    const reserva = await prisma.reserva.findUnique({
      where: { id },
    });

    if (!reserva) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    return res.status(200).json(reserva);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar a reserva.",
    });
  }
});

// Criar reserva
router.post("/", async (req, res) => {
  try {
    const { jogadorId, quadraId, inicio, fim, observacao } = req.body;

    if (!jogadorId || !quadraId || !inicio || !fim) {
      return res.status(400).json({
        mensagem: "Jogador, quadra, início e fim são obrigatórios.",
      });
    }

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
      return res.status(409).json({
        mensagem: "Já existe uma reserva nesse horário para esta quadra.",
      });
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

    return res.status(201).json(reserva);
  } catch (error) {
    console.error("Erro ao cadastrar reserva:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar a reserva.",
    });
  }
});

// Atualizar reserva
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { jogadorId, quadraId, inicio, fim, observacao } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    if (!jogadorId || !quadraId || !inicio || !fim) {
      return res.status(400).json({
        mensagem: "Jogador, quadra, início e fim são obrigatórios.",
      });
    }

    const reservaExistente = await prisma.reserva.findUnique({
      where: { id },
    });

    if (!reservaExistente) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

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
      return res.status(409).json({
        mensagem: "Já existe uma reserva nesse horário para esta quadra.",
      });
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

    return res.status(200).json(reserva);
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao atualizar a reserva.",
    });
  }
});

// Excluir reserva
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    const reservaExistente = await prisma.reserva.findUnique({
      where: { id },
    });

    if (!reservaExistente) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    await prisma.reserva.delete({
      where: { id },
    });

    return res.status(200).json({
      mensagem: "Reserva excluída com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir reserva:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao excluir a reserva.",
    });
  }
});

export default router;