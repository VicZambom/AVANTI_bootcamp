import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// Listar todos os jogadores
router.get("/", async (req, res) => {
  const jogadores = await prisma.jogador.findMany();
  res.json(jogadores);
});

// Buscar jogador por ID
router.get("/:id", async (req, res) => {
  const jogador = await prisma.jogador.findUnique({
    where: { id: Number(req.params.id) }
  });

  if (!jogador) {
    return res.status(404).json({ mensagem: "Jogador não encontrado" });
  }

  res.json(jogador);
});

// Criar jogador
router.post("/", async (req, res) => {
  const { nome, email, telefone } = req.body;

  const jogador = await prisma.jogador.create({
    data: {
      nome,
      email,
      telefone
    }
  });

  res.status(201).json(jogador);
});

// Atualizar jogador
router.put("/:id", async (req, res) => {
  const { nome, email, telefone } = req.body;

  const jogador = await prisma.jogador.update({
    where: { id: Number(req.params.id) },
    data: {
      nome,
      email,
      telefone
    }
  });

  res.json(jogador);
});

// Excluir jogador
router.delete("/:id", async (req, res) => {
  await prisma.jogador.delete({
    where: { id: Number(req.params.id) }
  });

  res.json({ mensagem: "Jogador excluído com sucesso!" });
});

export default router;