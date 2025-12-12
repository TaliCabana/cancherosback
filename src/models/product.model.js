import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0  },
  stock: { type: Number, default: 0, min: 0  },
  imageUrl: { type: String },
  
  category: { 
    type: String, 
    required: true, 
    enum: ['General', 'Hombre', 'Mujer', 'Ninios', 'Accesorios'], 
    default: 'General'
  },
  sizes: { 
    type: [String],
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Único'],
    default: 'Único'
  },
  
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});
const Product = mongoose.models('Product', productSchema)
export default Product