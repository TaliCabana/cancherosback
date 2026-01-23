import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const encriptarPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const generarToken = (usuario) => {
    return jwt.sign(
        { uid: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
};


export const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol = "usuario", telefono } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        const usuario = new Usuario({
            nombre,
            email,
            password: encriptarPassword(password), 
            rol,
            telefono
        });

        await usuario.save();
        
        res.status(201).json({
            mensaje: "Usuario creado exitosamente",
            nombre: usuario.nombre,
            uid: usuario._id,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear usuario" });
    }
};

export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
            return res.status(400).json({ mensaje: "Email o contraseña incorrectos" });
        }

        res.json({
            uid: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            token: generarToken(usuario),
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el login" });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-password"); 
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar usuarios" });
    }
};

export const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...datosParaActualizar } = req.body;

        if (password) {
            datosParaActualizar.password = encriptarPassword(password);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            datosParaActualizar,
            { new: true }
        ).select("-password");

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({
            mensaje: "Usuario actualizado correctamente",
            usuario: usuarioActualizado,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al editar usuario" });
    }
};

export const borrarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByIdAndDelete(id);
        
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al borrar usuario" });
    }
};