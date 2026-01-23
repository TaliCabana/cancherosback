import Producto from "../models/product.model.js";
import { v2 as cloudinary } from 'cloudinary';

const DEFAULT_IMAGE = "https://res.cloudinary.com/dhihpafup/image/upload/v1765849683/default-product_jkxepr.jpg";

const formatearTalles = (talles) => {
  return talles ? talles.split(",").map((s) => s.trim().toUpperCase()) : null;
};

export const obtenerProducto = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, talles } = req.body;
    
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      talles: formatearTalles(talles) || ["Único"],
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
    const { id } = req.params;
    const { talles, ...datosBody } = req.body;
    
    const tallesArray = formatearTalles(talles);
    const datosActualizar = { 
      ...datosBody,
      ...(tallesArray && { talles: tallesArray })
    };

    if (req.file) datosActualizar.imagen = req.file.path;

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
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
    const { id } = req.params;
    const producto = await Producto.findById(id);

    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

    if (producto.imagen && producto.imagen !== DEFAULT_IMAGE) {
      const publicId = `cancheros/${producto.imagen.split("/").pop().split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await Producto.findByIdAndDelete(id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ mensaje: "No se encontró el producto con ese ID" });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al intentar obtener el producto" });
  }
};