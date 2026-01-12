import { Router } from "express";
import { check } from "express-validator";
import {
  crearUsuario,
  loginUsuario,
  listarUsuarios,
  borrarUsuario,
  editarUsuario,
} from "../controllers/usuario.controller.js";

import { validarResultado } from "../helpers/validarCampos.js";
import { validarJWT } from "../helpers/validarJWT.js";

const router = Router();


const validacionesRegistro = [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("email", "El email es obligatorio y debe ser válido").isEmail(),
    check("password", "La contraseña debe tener 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo")
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/),
    validarResultado
];

const validacionesUpdate = [
    check("nombre", "El nombre no puede estar vacío").optional().notEmpty(),
    check("email", "El email debe ser válido").optional().isEmail(),
    validarResultado
];


router.post("/registro", validacionesRegistro, crearUsuario);

router.post("/login", [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    validarResultado
], loginUsuario);


router.get("/", validarJWT, listarUsuarios);

router.put("/:id", [validarJWT, ...validacionesUpdate], editarUsuario);

router.delete("/:id", validarJWT, borrarUsuario);

export default router;