import express from "express";
import { jogadorController } from "../controllers/jogadorController.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", jogadorController.listar);
router.get("/:id", jogadorController.buscarPorId);
router.post("/", autenticar, jogadorController.criar);
router.put("/:id", autenticar, jogadorController.atualizar);
router.delete("/:id", autenticar, jogadorController.excluir);

export default router;