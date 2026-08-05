import express from "express";
import { jogadorController } from "../controllers/jogadorController.js";

const router = express.Router();

router.get("/", jogadorController.listar);
router.get("/:id", jogadorController.buscarPorId);
router.post("/", jogadorController.criar);
router.put("/:id", jogadorController.atualizar);
router.delete("/:id", jogadorController.excluir);

export default router;