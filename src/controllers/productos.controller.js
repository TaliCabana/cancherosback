import Producto from "../models/product.model.js";

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
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      talles: req.body.talles,
      categoria: req.body.categoria,
      imagen: req.body.imagen || null,
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const borrarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
