import { quadraService } from "../services/quadraService.js";

export const quadraController = {
  async listar(req, res) {
    try {
      const quadras = await quadraService.listarTodas();
      return res.status(200).json(quadras);
    } catch (error) {
      console.error("Erro ao buscar quadras:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar as quadras." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);

      const quadra = await quadraService.buscarPorId(id);

      if (!quadra) {
        return res.status(404).json({ mensagem: "Quadra não encontrada." });
      }

      return res.status(200).json(quadra);
    } catch (error) {
      console.error("Erro ao buscar quadra:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar a quadra." });
    }
  },

  async criar(req, res) {
    try {
      const { nome, modalidade, localizacao } = req.body;

      if (!nome || !modalidade || !localizacao) {
        return res.status(400).json({ mensagem: "Nome, modalidade e localização são obrigatórios." });
      }

      if (!quadraService.modalidadesValidas.includes(modalidade)) {
        return res.status(400).json({
          mensagem: "Modalidade inválida.",
          modalidadesValidas: quadraService.modalidadesValidas,
        });
      }

      const novaQuadra = await quadraService.criar({ nome, modalidade, localizacao });
      return res.status(201).json(novaQuadra);
    } catch (error) {
      console.error("Erro ao cadastrar quadra:", error);
      return res.status(500).json({ mensagem: "Erro interno ao cadastrar a quadra." });
    }
  },

  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const { nome, modalidade, localizacao } = req.body;

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      if (!nome || !modalidade || !localizacao) {
        return res.status(400).json({ mensagem: "Nome, modalidade e localização são obrigatórios." });
      }

      if (!quadraService.modalidadesValidas.includes(modalidade)) {
        return res.status(400).json({
          mensagem: "Modalidade inválida.",
          modalidadesValidas: quadraService.modalidadesValidas,
        });
      }

      const quadraExistente = await quadraService.buscarPorId(id);
      if (!quadraExistente) {
        return res.status(404).json({ mensagem: "Quadra não encontrada." });
      }

      const quadraAtualizada = await quadraService.atualizar(id, { nome, modalidade, localizacao });
      return res.status(200).json(quadraAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar quadra:", error);
      return res.status(500).json({ mensagem: "Erro interno ao atualizar a quadra." });
    }
  },

  async excluir(req, res) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      const quadraExistente = await quadraService.buscarPorId(id);
      if (!quadraExistente) {
        return res.status(404).json({ mensagem: "Quadra não encontrada." });
      }

      await quadraService.excluir(id);
      return res.status(200).json({ mensagem: "Quadra excluída com sucesso." });
    } catch (error) {
      if (error.code === "P2003") {
        return res.status(409).json({ mensagem: "Não é possível excluir: esta quadra possui reservas." });
      }
      console.error("Erro ao excluir quadra:", error);
      return res.status(500).json({ mensagem: "Erro interno ao excluir a quadra." });
    }
  },
};