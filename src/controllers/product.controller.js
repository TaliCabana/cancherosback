import Producto from "../models/product.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const obtenerProducto = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const DEFAULT_IMAGE = "https://res.cloudinary.com/dhihpafup/image/upload/v1765849683/default-product_jkxepr.jpg"; 
export const crearProducto = async (req, res) => {
  try {
    let tallesArray = ["Único"];
    if (req.body.talles) {
      tallesArray = req.body.talles
        .split(",")
        .map((s) => s.trim().toUpperCase());
    }
     console.log("Archivo recibido:", req.file); 
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      talles: tallesArray,
      categoria: req.body.categoria,
      imagen: req.file ? req.file.path : DEFAULT_IMAGE,
    });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editarProducto = async (req, res) => {
  try {
    let tallesArray;
    if (req.body.talles) {
      tallesArray = req.body.talles
        .split(",")
        .map((s) => s.trim().toUpperCase());
    }

   const datosActualizar = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      categoria: req.body.categoria,
      ...(tallesArray && { talles: tallesArray }),
    };
    if (req.file) {
      datosActualizar.imagen = req.file.path;
    }
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true }
    );
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const borrarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

     if (producto.imagen && producto.imagen !== DEFAULT_IMAGE) {
      const urlParts = producto.imagen.split("/");
      const fileWithExtension = urlParts.pop();
      const publicId = `cancheros/${fileWithExtension.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
