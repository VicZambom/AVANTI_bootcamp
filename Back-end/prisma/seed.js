import bcrypt from "bcryptjs";
import { prisma } from "../src/prisma.js";

async function main() {
  const email = "gerente@ruffo.com";
  const senhaPura = "123456";

  const senhaHash = await bcrypt.hash(senhaPura, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      nome: "Gerente",
      email,
      senha: senhaHash,
    },
  });

  console.log("Usuário pronto:", usuario.email);
  console.log("Senha para login:", senhaPura);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());