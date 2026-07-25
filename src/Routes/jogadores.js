import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// Listar todos os jogadores
router.get("/", async (req, res) => {
  try {
    const jogadores = await prisma.jogador.findMany();
    return res.status(200).json(jogadores);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar os jogadores.",
    });
  }
});

// Buscar jogador por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    const jogador = await prisma.jogador.findUnique({
      where: { id },
    });

    if (!jogador) {
      return res.status(404).json({
        mensagem: "Jogador não encontrado.",
      });
    }

    return res.status(200).json(jogador);
  } catch (error) {
    console.error("Erro ao buscar jogador:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar o jogador.",
    });
  }
});

// Criar jogador
router.post("/", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({
        mensagem: "Nome, e-mail e telefone são obrigatórios.",
      });
    }

    const jogador = await prisma.jogador.create({
      data: {
        nome,
        email,
        telefone,
      },
    });

    return res.status(201).json(jogador);
  } catch (error) {
    console.error("Erro ao cadastrar jogador:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar o jogador.",
    });
  }
});

// Atualizar jogador
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, telefone } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    const jogadorExistente = await prisma.jogador.findUnique({
      where: { id },
    });

    if (!jogadorExistente) {
      return res.status(404).json({
        mensagem: "Jogador não encontrado.",
      });
    }

    const jogador = await prisma.jogador.update({
      where: { id },
      data: {
        nome,
        email,
        telefone,
      },
    });

    return res.status(200).json(jogador);
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao atualizar o jogador.",
    });
  }
});

// Excluir jogador
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido.",
      });
    }

    const jogadorExistente = await prisma.jogador.findUnique({
      where: { id },
    });

    if (!jogadorExistente) {
      return res.status(404).json({
        mensagem: "Jogador não encontrado.",
      });
    }

    await prisma.jogador.delete({
      where: { id },
    });

    return res.status(200).json({
      mensagem: "Jogador excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir jogador:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao excluir o jogador.",
    });
  }
});

export default router;