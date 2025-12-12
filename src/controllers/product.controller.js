import Product from '../models/product.model.js'; 
import { v2 as cloudinary } from 'cloudinary';
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    let sizesArray = ['Único'];
    if (req.body.sizes) {
      sizesArray = req.body.sizes.split(',').map(s => s.trim().toUpperCase());
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      sizes: sizesArray, 
      imageUrl: req.file ? req.file.path : null 
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let sizesArray;
    if (req.body.sizes) {
      sizesArray = req.body.sizes.split(',').map(s => s.trim().toUpperCase());
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      ...(sizesArray && { sizes: sizesArray }),
    };

    if (req.file) {
       productData.imageUrl = req.file.path; 
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      productData, 
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.imageUrl) {
        const urlParts = product.imageUrl.split('/');
        const fileWithExtension = urlParts.pop(); 
        const publicId = `cancheros/${fileWithExtension.split('.')[0]}`; 
        await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Producto eliminado y foto borrada de la nube' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};