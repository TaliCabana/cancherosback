import { Router } from "express";
import {
  obtenerProducto,
  crearProducto,
  editarProducto,
  borrarProducto,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", obtenerProducto);
router.post("/", crearProducto);
router.put("/:id", editarProducto);
router.delete("/:id", borrarProducto);

export default router;
