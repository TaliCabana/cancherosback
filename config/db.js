const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Base de datos conectada con éxito');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = connectDB;