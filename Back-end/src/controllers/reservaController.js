import { reservaService } from "../services/reservaService.js";

export const reservaController = {
  async listar(req, res) {
    try {
      const { quadraId, data } = req.query;

      if (quadraId && Number.isNaN(Number(quadraId))) {
        return res.status(400).json({ mensagem: "quadraId inválido." });
      }

      if (data && Number.isNaN(new Date(`${data}T00:00:00.000Z`).getTime())) {
        return res.status(400).json({ mensagem: "Data inválida. Use o formato AAAA-MM-DD." });
      }

      const reservas = await reservaService.listarTodas({ quadraId, data });
      return res.status(200).json(reservas);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar as reservas." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      const reserva = await reservaService.buscarPorId(id);

      if (!reserva) {
        return res.status(404).json({ mensagem: "Reserva não encontrada." });
      }

      return res.status(200).json(reserva);
    } catch (error) {
      console.error("Erro ao buscar reserva:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar a reserva." });
    }
  },

  async criar(req, res) {
    try {
      const { jogadorId, quadraId, inicio, fim, observacao } = req.body;

      if (!jogadorId || !quadraId || !inicio || !fim) {
        return res.status(400).json({ mensagem: "Jogador, quadra, início e fim são obrigatórios." });
      }

      const inicioData = new Date(inicio);
      const fimData = new Date(fim);

      if (Number.isNaN(inicioData.getTime()) || Number.isNaN(fimData.getTime())) {
        return res.status(400).json({
          mensagem: "Data ou horário inválido. Use o formato ISO (ex: 2026-08-20T15:00:00.000Z).",
        });
      }

      if (fimData <= inicioData) {
        return res.status(400).json({
          mensagem: "O horário de fim deve ser posterior ao horário de início.",
        });
      }

      const conflito = await reservaService.buscarConflito({ quadraId, inicioData, fimData });

      if (conflito) {
        return res.status(409).json({ mensagem: "Já existe uma reserva nesse horário para esta quadra." });
      }

      const reserva = await reservaService.criar({ jogadorId, quadraId, inicio, fim, observacao });
      return res.status(201).json(reserva);
    } catch (error) {
      console.error("Erro ao cadastrar reserva:", error);
      return res.status(500).json({ mensagem: "Erro interno ao cadastrar a reserva." });
    }
  },

  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const { jogadorId, quadraId, inicio, fim, observacao } = req.body;

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      if (!jogadorId || !quadraId || !inicio || !fim) {
        return res.status(400).json({ mensagem: "Jogador, quadra, início e fim são obrigatórios." });
      }

      const reservaExistente = await reservaService.buscarPorId(id);
      if (!reservaExistente) {
        return res.status(404).json({ mensagem: "Reserva não encontrada." });
      }

      const inicioData = new Date(inicio);
      const fimData = new Date(fim);

      if (Number.isNaN(inicioData.getTime()) || Number.isNaN(fimData.getTime())) {
        return res.status(400).json({
          mensagem: "Data ou horário inválido. Use o formato ISO (ex: 2026-08-20T15:00:00.000Z).",
        });
      }

      if (fimData <= inicioData) {
        return res.status(400).json({
          mensagem: "O horário de fim deve ser posterior ao horário de início.",
        });
      }

      const conflito = await reservaService.buscarConflito({ quadraId, inicioData, fimData, ignorarId: id });

      if (conflito) {
        return res.status(409).json({ mensagem: "Já existe uma reserva nesse horário para esta quadra." });
      }

      const reserva = await reservaService.atualizar(id, { jogadorId, quadraId, inicio, fim, observacao });
      return res.status(200).json(reserva);
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);
      return res.status(500).json({ mensagem: "Erro interno ao atualizar a reserva." });
    }
  },

  async cancelar(req, res) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido." });
      }

      const reservaExistente = await reservaService.buscarPorId(id);
      if (!reservaExistente) {
        return res.status(404).json({ mensagem: "Reserva não encontrada." });
      }

      await reservaService.cancelar(id);
      return res.status(200).json({ mensagem: "Reserva cancelada com sucesso." });
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      return res.status(500).json({ mensagem: "Erro interno ao cancelar a reserva." });
    }
  },
};