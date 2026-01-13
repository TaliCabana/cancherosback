import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true,"El nombre del producto es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true,"LA descripción es obligatoria"],
      trim:true
    },
    precio: {
      type: Number, 
      required: [true,"El precio es obligatorio"],
      min:[0,"El precio no puede ser negativo"]
    },
    talles: {
      type: [String],
      required: true,
      default:["Único"]
    },
    imagen: {
      type: String, 
      default:"https://res.cloudinary.com/dhihpafup/image/upload/v1765849683/default-product_jkxepr.jpg"
    },
    categoria: {
      type: String,
      enum: {
        values:["ellas", "hombre", "niños", "accesorios"],
        message:"{VALUE} no es una categoría válida"},
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
