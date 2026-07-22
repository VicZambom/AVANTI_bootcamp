
import express from "express";
import jogadoresRoutes from "./Routes/jogadores.js";
import quadrasRoutes from "./Routes/quadra.js";
import reservasRoutes from "./routes/reservas.js";

const app = express();

app.use(express.json());

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