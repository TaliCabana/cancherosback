import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
       usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: [true, 'El usuario es obligatorio'] 
    },
   
    telefono: { 
        type: String, 
        required: [true, 'El teléfono es obligatorio'],
        match: [/^\d{8,15}$/, 'El teléfono debe tener entre 8 y 15 dígitos']
    },
    cancha: { 
        type: String, 
        required: [true, 'La cancha es obligatoria'],
        enum: ['Cancha 1', 'Cancha 2'] // 
    },

    fecha: { 
        type: Date, 
        required: [true, 'La fecha es obligatoria'] 
    },
    horario: { 
        type: String, 
        required: [true, 'El horario es obligatorio'],
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato de horario inválido (HH:mm)']
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado'],
        default: 'pendiente'
    }
}, { timestamps: true }); // 

export default mongoose.model('Reserva', reservaSchema);