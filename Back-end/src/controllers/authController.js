import { authService } from "../services/authService.js";

export const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
      }

      const usuario = await authService.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
      }

      const confere = await authService.senhaConfere(senha, usuario.senha);

      if (!confere) {
        return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
      }

      const token = authService.gerarToken(usuario);

      return res.status(200).json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ mensagem: "Erro interno ao fazer login." });
    }
  },
};