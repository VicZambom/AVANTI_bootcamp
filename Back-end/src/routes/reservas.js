import express from "express";
import { reservaController } from "../controllers/reservaController.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", reservaController.listar);
router.get("/:id", reservaController.buscarPorId);
router.post("/", reservaController.criar);
router.post("/solicitacao", reservaController.solicitar);
router.put("/:id", autenticar, reservaController.atualizar);
router.delete("/:id", autenticar, reservaController.cancelar);

export default router;