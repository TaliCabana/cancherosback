import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.model.js';

export const validarJWT = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'No hay token en la petición o formato inválido'
        });
    }

    try {
        const token = authHeader.split(' ')[1];

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Token no válido - usuario no existe'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            mensaje: 'Token no válido'
        });
    }
};