import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// Listar todas as quadras
router.get("/", async (req, res) => {
  try {
    const quadras = await prisma.quadra.findMany();

    return res.status(200).json(quadras);
  } catch (error) {
    console.error("Erro ao buscar quadras:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar as quadras.",
    });
  }
});

// Buscar uma quadra por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const quadra = await prisma.quadra.findUnique({
      where: {
        id,
      },
    });

    if (!quadra) {
      return res.status(404).json({
        mensagem: "Quadra não encontrada.",
      });
    }

    return res.status(200).json(quadra);
  } catch (error) {
    console.error("Erro ao buscar quadra:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar a quadra.",
    });
  }
});

// Cadastrar uma nova quadra
router.post("/", async (req, res) => {
  try {
    const { nome, modalidade, localizacao } = req.body;

    const modalidadesValidas = [
      "FUTEBOL",
      "FUTSAL",
      "VOLEI",
      "BASQUETE",
      "TENIS",
      "HANDEBOL",
      "OUTRO",
    ];

    if (!nome || !modalidade || !localizacao) {
      return res.status(400).json({
        mensagem: "Nome, modalidade e localização são obrigatórios.",
      });
    }

    if (!modalidadesValidas.includes(modalidade)) {
      return res.status(400).json({
        mensagem: "Modalidade inválida.",
        modalidadesValidas,
      });
    }

    const novaQuadra = await prisma.quadra.create({
      data: {
        nome,
        modalidade,
        localizacao,
      },
    });

    return res.status(201).json(novaQuadra);
  } catch (error) {
    console.error("Erro ao cadastrar quadra:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar a quadra.",
    });
  }
});


// Atualizar uma quadra
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, modalidade, localizacao } = req.body;

    const modalidadesValidas = [
      "FUTEBOL",
      "FUTSAL",
      "VOLEI",
      "BASQUETE",
      "TENIS",
      "HANDEBOL",
      "OUTRO",
    ];

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    if (!nome || !modalidade || !localizacao) {
      return res.status(400).json({
        mensagem: "Nome, modalidade e localização são obrigatórios.",
      });
    }

    if (!modalidadesValidas.includes(modalidade)) {
      return res.status(400).json({
        mensagem: "Modalidade inválida.",
        modalidadesValidas,
      });
    }

    const quadraExistente = await prisma.quadra.findUnique({
      where: {
        id,
      },
    });

    if (!quadraExistente) {
      return res.status(404).json({
        mensagem: "Quadra não encontrada.",
      });
    }

    const quadraAtualizada = await prisma.quadra.update({
      where: {
        id,
      },
      data: {
        nome,
        modalidade,
        localizacao,
      },
    });

    return res.status(200).json(quadraAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar quadra:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao atualizar a quadra.",
    });
  }
});

// Excluir uma quadra
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    const quadraExistente = await prisma.quadra.findUnique({
      where: {
        id,
      },
    });

    if (!quadraExistente) {
      return res.status(404).json({
        mensagem: "Quadra não encontrada.",
      });
    }

    await prisma.quadra.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      mensagem: "Quadra excluída com sucesso.",
    });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(409).json({
        mensagem: "Não é possível excluir: esta quadra possui reservas.",
      });
    }
    console.error("Erro ao excluir quadra:", error);
    return res.status(500).json({ mensagem: "Erro interno ao excluir a quadra." });
  }
});

export default router;