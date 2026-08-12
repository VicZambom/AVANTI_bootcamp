import { prisma } from "../prisma.js";

export const reservaService = {
  async listarTodas() {
    return prisma.reserva.findMany({
        where: {
          status: "ATIVA"},
        });
      },

  async buscarPorId(id) {
    return prisma.reserva.findUnique({ where: { id } });
  },

  async buscarConflito({ quadraId, inicioData, fimData, ignorarId }) {
    return prisma.reserva.findFirst({
      where: {
        ...(ignorarId ? { id: { not: ignorarId } } : {}),
        status: "ATIVA",
        quadraId: Number(quadraId),
        inicio: { lt: fimData },
        fim: { gt: inicioData },
      },
    });
  },

  async criar(dados) {
    const { jogadorId, quadraId, inicio, fim, observacao } = dados;
    return prisma.reserva.create({
      data: {
        jogadorId: Number(jogadorId),
        quadraId: Number(quadraId),
        inicio: new Date(inicio),
        fim: new Date(fim),
        observacao: observacao || null,
      },
    });
  },

  async atualizar(id, dados) {
    const { jogadorId, quadraId, inicio, fim, observacao } = dados;
    return prisma.reserva.update({
      where: { id },
      data: {
        jogadorId: Number(jogadorId),
        quadraId: Number(quadraId),
        inicio: new Date(inicio),
        fim: new Date(fim),
        observacao: observacao || null,
      },
    });
  },

  async cancelar(id) {
    return prisma.reserva.update({
      where: { id },
      data: { status: "CANCELADA" },
    });
  },
};