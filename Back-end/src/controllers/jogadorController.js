import { jogadorService } from "../services/jogadorService.js";

export const jogadorController = {
  async listar(req, res) {
    try {
      const jogadores = await jogadorService.listarTodos();
      return res.status(200).json(jogadores);
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar os jogadores." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      const jogador = await jogadorService.buscarPorId(id);

      if (!jogador) {
        return res.status(404).json({ mensagem: "Jogador não encontrado." });
      }

      return res.status(200).json(jogador);
    } catch (error) {
      console.error("Erro ao buscar jogador:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar o jogador." });
    }
  },

  async criar(req, res) {
    try {
      const { nome, email, telefone } = req.body;

      if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: "Nome, e-mail e telefone são obrigatórios." });
      }

      const jogador = await jogadorService.criar({ nome, email, telefone });
      return res.status(201).json(jogador);
    } catch (error) {
      console.error("Erro ao cadastrar jogador:", error);
      return res.status(500).json({ mensagem: "Erro interno ao cadastrar o jogador." });
    }
  },

  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const { nome, email, telefone } = req.body;

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      const jogadorExistente = await jogadorService.buscarPorId(id);
      if (!jogadorExistente) {
        return res.status(404).json({ mensagem: "Jogador não encontrado." });
      }

      const jogador = await jogadorService.atualizar(id, { nome, email, telefone });
      return res.status(200).json(jogador);
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
      return res.status(500).json({ mensagem: "Erro interno ao atualizar o jogador." });
    }
  },

  async excluir(req, res) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      const jogadorExistente = await jogadorService.buscarPorId(id);
      if (!jogadorExistente) {
        return res.status(404).json({ mensagem: "Jogador não encontrado." });
      }

      await jogadorService.excluir(id);
      return res.status(200).json({ mensagem: "Jogador excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir jogador:", error);
      return res.status(500).json({ mensagem: "Erro interno ao excluir o jogador." });
    }
  },
};