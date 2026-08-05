import { prisma } from "../prisma.js";

export const jogadorService = {
  async listarTodos() {
    return prisma.jogador.findMany();
  },

  async buscarPorId(id) {
    return prisma.jogador.findUnique({ where: { id } });
  },

  async criar(dados) {
    const { nome, email, telefone } = dados;
    return prisma.jogador.create({
      data: { nome, email, telefone },
    });
  },

  async atualizar(id, dados) {
    const { nome, email, telefone } = dados;
    return prisma.jogador.update({
      where: { id },
      data: { nome, email, telefone },
    });
  },

  async excluir(id) {
    return prisma.jogador.delete({ where: { id } });
  },
};