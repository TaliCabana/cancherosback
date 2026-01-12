import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';


const encriptarPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const crearAdminPorDefecto = async () => {
    const ADMIN_EMAIL = "admin@cancheros.com";

    try {
        const adminExistente = await Usuario.findOne({ email: ADMIN_EMAIL });

        if (adminExistente) {
       
            return console.info("✅ Admin listo.");
        }

        const nuevoAdmin = new Usuario({
            nombre: "Super Administrador",
            email: ADMIN_EMAIL,
            password: encriptarPassword("Admin123!"), 
            rol: "admin"
        });

        await nuevoAdmin.save();
        console.info("🚀 Super Administrador creado con éxito.");

    } catch (error) {
        console.error("❌ Error al inicializar Admin:", error);
    }
};