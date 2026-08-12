import express from "express";
import { quadraController } from "../controllers/quadraController.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", quadraController.listar);
router.get("/:id", quadraController.buscarPorId);
router.post("/", autenticar, quadraController.criar);
router.put("/:id", autenticar, quadraController.atualizar);
router.delete("/:id", autenticar, quadraController.excluir);

export default router;