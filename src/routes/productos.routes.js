import { Router } from "express";
import { check } from 'express-validator'; 
import { 
  obtenerProducto,
  crearProducto,
  editarProducto,
  borrarProducto,
  obtenerProductoPorId
} from "../controllers/product.controller.js";

import { validarResultado } from '../helpers/validarCampos.js'; 
import { validarJWT } from '../helpers/validarJWT.js'; 
import upload from '../helpers/uploadImages.js'; 

const router = Router();


const validacionesProducto = [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('precio', 'El precio debe ser numérico').isNumeric(),
    check('categoria', 'La categoría es obligatoria').notEmpty(),
    validarResultado 
];


router.get("/", obtenerProducto);
router.get('/:id', obtenerProductoPorId);


router.post('/', 
    validarJWT, 
    upload.single('imagen'), 
    validacionesProducto,
    crearProducto 
);

router.put('/:id', 
    validarJWT,
    upload.single('imagen'), 
    validacionesProducto,
    editarProducto 
);

router.delete("/:id", validarJWT, borrarProducto);

export default router;