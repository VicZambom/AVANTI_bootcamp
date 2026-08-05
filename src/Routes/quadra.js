import express from "express";
import { quadraController } from "../controllers/quadraController.js";

const router = express.Router();

router.get("/", quadraController.listar);
router.get("/:id", quadraController.buscarPorId);
router.post("/", quadraController.criar);
router.put("/:id", quadraController.atualizar);
router.delete("/:id", quadraController.excluir);

export default router;