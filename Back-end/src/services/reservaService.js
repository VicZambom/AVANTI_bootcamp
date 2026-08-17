import { prisma } from "../prisma.js";

export const reservaService = {
  async listarTodas(filtros = {}) {
    const { quadraId, data, incluirCanceladas } = filtros;

    const where = {};
    if (!incluirCanceladas) where.status = "ATIVA";

    if (quadraId) {
      where.quadraId = Number(quadraId);
    }

    if (data) {
      const inicioDia = new Date(`${data}T00:00:00.000Z`);
      const fimDia = new Date(inicioDia);
      fimDia.setUTCDate(fimDia.getUTCDate() + 1);
      where.inicio = { gte: inicioDia, lt: fimDia };
    }

    return prisma.reserva.findMany({
      where,
      include: { jogador: true, quadra: true },
      orderBy: { inicio: "asc" },
    });
  },

  async buscarPorId(id) {
    return prisma.reserva.findUnique({ 
      where: { id },
      include: {
        jogador: true,
        quadra: true,
      }, 
    });
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

  async criarSolicitacao({ nome, email, telefone, quadraId, inicioData, fimData, observacao }) {
    return prisma.$transaction(async (tx) => {

      const jogador = await tx.jogador.upsert({
      where: { email },
      update: { nome, telefone },
      create: { nome, email, telefone },
    });

      const conflito = await tx.reserva.findFirst({
        where: {
          status: "ATIVA",
          quadraId: Number(quadraId),
          inicio: { lt: fimData },
          fim: { gt: inicioData },
        },
      });

      if (conflito) {
        throw new Error("CONFLITO");
      }

      return tx.reserva.create({
        data: {
          jogadorId: jogador.id,
          quadraId: Number(quadraId),
          inicio: inicioData,
          fim: fimData,
          observacao: observacao || null,
        },
        include: { jogador: true, quadra: true },
      });
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

