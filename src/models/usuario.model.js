import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true,"El nombre es obligatorio"],
        trim: true,
        minLength: [3,"El nombre debe tener al menos 3 caracteres"],
        maxLength: [50,"El nombre debe tener mínimo 50 caracteres"]
    },
    email: {
        type: String,
        unique: true, 
        required: [true,"El correo electrónico es obligatorio"],
        trim: true,
        lowercase: true,
        match:[/^\S+@\S+\.\S+$/,"Por favor, ingrese un Email válido"] 
    },
     telefono: {
        type: String,
        required: [true,"El teléfono de contacto es obligatorio"],
        trim: true
    },
    password: {
        type: String,
        required:[true,"La contraseña es obligatoria"]
    },
    rol: {
        type: String,
        enum: {values:['usuario', 'admin'],
            message:'{VALUE} no es un rol válido'
        },
        default: 'usuario'
    }
}, {
    timestamps: true 
});

export default mongoose.model('Usuario', usuarioSchema);