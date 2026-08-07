import { prisma } from "../prisma.js";

const MODALIDADES_VALIDAS = [
  "FUTEBOL",
  "FUTSAL",
  "VOLEI",
  "BASQUETE",
  "TENIS",
  "HANDEBOL",
  "OUTRO",
];

export const quadraService = {
  modalidadesValidas: MODALIDADES_VALIDAS,

  async listarTodas() {
    return prisma.quadra.findMany();
  },

  async buscarPorId(id) {
    return prisma.quadra.findUnique({ where: { id } });
  },

  async criar(dados) {
    const { nome, modalidade, localizacao } = dados;
    return prisma.quadra.create({
      data: { nome, modalidade, localizacao },
    });
  },

  async atualizar(id, dados) {
    const { nome, modalidade, localizacao } = dados;
    return prisma.quadra.update({
      where: { id },
      data: { nome, modalidade, localizacao },
    });
  },

  async excluir(id) {
    return prisma.quadra.delete({ where: { id } });
  },
};