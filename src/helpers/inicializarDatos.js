import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';

export const crearAdminPorDefecto = async () => {
  try {
    const emailAdmin = "admin@cancheros.com";
    const adminExistente = await Usuario.findOne({ email: emailAdmin });

    if (adminExistente) {
      console.log("✅ El Administrador ya está listo.");
      return;
    }

    const nuevoAdmin = new Usuario({
      nombre: "Super Administrador",
      email: emailAdmin,
      password: "Admin123!", 
      rol: "admin",
      telefono: "3811234567" 
    });

    const salt = bcrypt.genSaltSync(10);
    nuevoAdmin.password = bcrypt.hashSync(nuevoAdmin.password, salt);

    await nuevoAdmin.save();

  } catch (error) {
    console.error("Error al inicializar datos:", error);
  }
};