import { Router } from "express";
import productosRoutes from "./productos.routes.js";
const router = Router();
router.use('/productos', productosRoutes)
export default router;