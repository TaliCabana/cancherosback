import { Router } from "express";
import productosRoutes from "./productos.routes.js";
import usuariosRoutes from "./usuario.routes.js"; 
import reservasRoutes from "./reservas.routes.js"; 
const router = Router();


router.use('/productos', productosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/reservas', reservasRoutes);

export default router;