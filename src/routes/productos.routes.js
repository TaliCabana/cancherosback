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
router.post("/", upload.single("imagen"), crearProducto);
router.put("/:id", upload.single("imagen"), editarProducto);
router.delete("/:id", borrarProducto);

export default router;
