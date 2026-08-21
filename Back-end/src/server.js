
import express from "express";
import authRoutes from "./routes/auth.js";
import jogadoresRoutes from "./routes/jogadores.js";
import quadrasRoutes from "./routes/quadra.js";
import reservasRoutes from "./routes/reservas.js";
import cors from "cors";

const app = express();
const origensPermitidas = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: origensPermitidas }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/jogadores", jogadoresRoutes);
app.use("/quadras", quadrasRoutes);
app.use("/reservas", reservasRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 