import { Router } from 'express';
import { check } from 'express-validator';
import {
    getReservas,
    createReserva,
    updateReserva,
    deleteReserva
} from '../controllers/reservas.controller.js';

import { validarJWT } from '../helpers/validarJWT.js';
import { validarResultado } from '../helpers/validarCampos.js';

const router = Router();


const validacionesReserva = [
    check('usuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('telefono', 'El teléfono es obligatorio').notEmpty(),
    check('cancha', 'La cancha es obligatoria').notEmpty(),
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('horario', 'El horario es obligatorio').notEmpty(),
    validarResultado
];


router.get('/', [validarJWT], getReservas);

router.post('/', [
    validarJWT,
    ...validacionesReserva
], createReserva);

router.put('/:id', [
    validarJWT,
    validarResultado
], updateReserva);

router.delete('/:id', [validarJWT], deleteReserva);

export default router;