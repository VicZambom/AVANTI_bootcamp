import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

export const authService = {
  async buscarPorEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  async senhaConfere(senhaDigitada, senhaHash) {
    return bcrypt.compare(senhaDigitada, senhaHash);
  },

  gerarToken(usuario) {
    return jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
  },
};