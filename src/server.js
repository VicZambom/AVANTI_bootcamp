
import express from "express";
import jogadoresRoutes from "./Routes/jogadores.js";

const app = express();

app.use(express.json());

app.use("/jogadores", jogadoresRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});