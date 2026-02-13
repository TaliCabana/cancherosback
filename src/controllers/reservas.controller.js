import Reserva from "../models/reserva.js";
import mongoose from "mongoose";

const CANCHAS_VALIDAS = ["Cancha 1", "Cancha 2"];
const HORARIO_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const TELEFONO_REGEX = /^\d{8,15}$/;

const validarFecha = (fecha) => {
  const fechaReserva = new Date(fecha);
  if (isNaN(fechaReserva.getTime()))
    return { valido: false, msj: "Fecha inválida" };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaReserva.setHours(0, 0, 0, 0);

  if (fechaReserva < hoy)
    return { valido: false, msj: "No se permiten fechas pasadas" };
  return { valido: true };
};

const validarDatosComunes = (datos) => {
  const { telefono, cancha, horario, fecha } = datos;

  if (telefono && !TELEFONO_REGEX.test(telefono.trim()))
    return "El teléfono debe contener solo números y tener entre 8 y 15 dígitos";

  if (cancha && !CANCHAS_VALIDAS.includes(cancha)) return "Cancha inválida";

  if (horario && !HORARIO_REGEX.test(horario)) return "Horario inválido";

  if (fecha) {
    const checkFecha = validarFecha(fecha);
    if (!checkFecha.valido) return checkFecha.msj;
  }
  return null;
};

export const getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().populate("usuario", "nombre");
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reservas" });
  }
};

export const createReserva = async (req, res) => {
  try {
    const { nombreCliente, telefono, cancha, fecha, horario } = req.body;

    if (!nombreCliente || !telefono || !cancha || !fecha || !horario) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const errorValidacion = validarDatosComunes({
      nombreCliente,
      telefono,
      cancha,
      horario,
      fecha,
    });
    if (errorValidacion)
      return res.status(400).json({ message: errorValidacion });

/*     if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res
        .status(400)
        .json({ message: "ID de usuario no válido para la relación" });
    } */

    const existeReserva = await Reserva.findOne({ cancha, fecha, horario });
    if (existeReserva)
      return res
        .status(409)
        .json({ message: "La cancha ya está reservada en ese horario" });

    const reserva = new Reserva({
      usuario: req.usuario._id,
      nombreCliente: nombreCliente.trim(),
      telefono: telefono.trim(),
      cancha,
      fecha,
      horario,
    });

    await reserva.save();

    const reservaNueva = await Reserva.findById(reserva._id).populate(
      "usuario",
      "nombre",
    );

    res.status(201).json(reservaNueva);
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
};

export const updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID inválido" });

    const errorValidacion = validarDatosComunes(req.body);
    if (errorValidacion)
      return res.status(400).json({ message: errorValidacion });

    const reservaActual = await Reserva.findById(id);
    if (!reservaActual)
      return res.status(404).json({ message: "Reserva no encontrada" });

    const { cancha, fecha, horario, nombreCliente, telefono, estado } = req.body;
    const nuevaCancha = cancha || reservaActual.cancha;
    const nuevaFecha = fecha || reservaActual.fecha;
    const nuevoHorario = horario || reservaActual.horario;

    const conflicto = await Reserva.findOne({
      _id: { $ne: id },
      cancha: nuevaCancha,
      fecha: nuevaFecha,
      horario: nuevoHorario,
    });

    if (conflicto)
      return res
        .status(409)
        .json({ message: "La cancha ya está reservada en ese horario" });

    const updateFields = {
      ...(nombreCliente && { nombreCliente: nombreCliente.trim() }),
      ...(telefono && { telefono: telefono.trim() }),
      ...(cancha && { cancha }),
      ...(fecha && { fecha }),
      ...(horario && { horario }),
      ...(estado && ["pendiente", "confirmado"].includes(estado) && { estado }),
    };

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      updateFields,
      { new: true },
    ).populate("usuario", "nombre");
    res.status(200).json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar reserva" });
  }
};

export const deleteReserva = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID inválido" });

    const reserva = await Reserva.findByIdAndDelete(id);
    if (!reserva)
      return res.status(404).json({ message: "Reserva no encontrada" });

    res.status(200).json({ message: "Reserva eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reserva" });
  }
};
