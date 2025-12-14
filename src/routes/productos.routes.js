import { Router } from "express";
import {
  getProducts,
  crearProducto,
  editarProducto,
  borrarProducto,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/", crearProducto);
router.put("/:id", editarProducto);
router.delete("/:id", borrarProducto);

export default router;
