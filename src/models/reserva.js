import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    telefono: {
        type: String,
        required: true,
        match: [/^\d{8,15}$/, 'Teléfono inválido']
    },
    cancha: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    horario: {
        type: Date,
        required: true,
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Horario inválido']
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado'],
        default: 'pendiente'
    }
}, { timestamps: true }); // 

export default mongoose.model('Reserva', reservaSchema);
