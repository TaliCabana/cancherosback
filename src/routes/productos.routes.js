import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  obtenerProducto,
  crearProducto,
  editarProducto,
  borrarProducto,
} from "../controllers/product.controller.js";
import { check } from "express-validator";
import { validarResultado } from "../helpers/validarCampos.js";
import { validarJWT } from "../helpers/validarJWT.js";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cancheros",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });
const router = Router();

router.get("/", obtenerProducto);
router.post(
  "/",
  validarJWT,
  upload.single("imagen"),
  [
    check("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ min: 5, max: 30 })
      .withMessage("El nombre debe tener entre 5 y 30 caracteres"),
    check('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .custom((value) => {
        const limpio = value.toString().replace('$', '').trim();
        if (isNaN(limpio)) {
            throw new Error('El precio debe contener solo números');
        }
        if (parseFloat(limpio) <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        return true;
    }),
    check("descripcion")
      .notEmpty()
      .withMessage("La descripción es obligatoria")
      .isLength({ min: 5, max: 50 })
      .withMessage("La descripción debe tener entre 5 y 50 caracteres"),
    check("categoria", "La categoría es obligatoria").notEmpty(),
    check("talles")
      .notEmpty()
      .withMessage("Debes especificar al menos un talle"),
    validarResultado,
  ],
  crearProducto
);
router.put(
  "/:id",
  validarJWT,
  upload.single("imagen"),
  [
    check("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ min: 5, max: 30 })
      .withMessage("El nombre debe tener entre 5 y 30 caracteres"),
    check("precio")
      .notEmpty()
      .withMessage("El precio es obligatorio")
      .custom((value) => {
        const precio = parseFloat(value.toString().replace("$", ""));
        if (isNaN(precio) || precio <= 0) {
          throw new Error("El precio debe ser un número positivo mayor a 0");
        }
        return true;
      }),
    check("descripcion")
      .notEmpty()
      .withMessage("La descripción es obligatoria")
      .isLength({ min: 5, max: 50 })
      .withMessage("La descripción debe tener entre 5 y 50 caracteres"),
    check("categoria", "La categoría es obligatoria").notEmpty(),
    validarResultado,
  ],
  editarProducto
);

router.delete("/:id", validarJWT, borrarProducto);

export default router;
