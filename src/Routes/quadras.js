import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// Listar todas as quadras
router.get("/", async (req, res) => {
  const quadras = await prisma.quadra.findMany();
  res.json(quadras);
});

// Buscar quadra por ID
router.get("/:id", async (req, res) => {
  const quadra = await prisma.quadra.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!quadra) {
    return res.status(404).json({
      mensagem: "Quadra não encontrada",
    });
  }

  res.json(quadra);
});

// Criar quadra
router.post("/", async (req, res) => {
  const { nome, modalidade, localizacao } = req.body;

  const quadra = await prisma.quadra.create({
    data: {
      nome,
      modalidade,
      localizacao,
    },
  });

  res.status(201).json(quadra);
});

// Atualizar quadra
router.put("/:id", async (req, res) => {
  const { nome, modalidade, localizacao } = req.body;

  const quadra = await prisma.quadra.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      nome,
      modalidade,
      localizacao,
    },
  });

  res.json(quadra);
});

// Excluir quadra
router.delete("/:id", async (req, res) => {
  await prisma.quadra.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.json({
    mensagem: "Quadra excluída com sucesso!",
  });
});

export default router;