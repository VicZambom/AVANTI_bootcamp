import express from "express";
import jogadoresRoutes from "./Routes/jogadores.js";
import quadraRoutes from "./Routes/quadra.js";

const app = express();

app.use(express.json());

// Rotas
app.use("/jogadores", jogadoresRoutes);
app.use("/quadras", quadraRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});