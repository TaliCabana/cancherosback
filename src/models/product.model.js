import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
  
  category: { 
    type: String, 
    required: true, 
    enum: ['General', 'Hombre', 'Mujer', 'Ninios', 'Accesorios'], 
    default: 'General'
  },
  sizes: { 
    type: String, 
    default: 'Único'
  },
  
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Producto = mongoose.model('product', productSchema);

export default Producto;