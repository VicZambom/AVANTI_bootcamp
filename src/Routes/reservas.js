import express from "express";
import { reservaController } from "../controllers/reservaController.js";

const router = express.Router();

router.get("/", reservaController.listar);
router.get("/:id", reservaController.buscarPorId);
router.post("/", reservaController.criar);
router.put("/:id", reservaController.atualizar);
router.delete("/:id", reservaController.excluir);

export default router;