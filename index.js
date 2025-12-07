const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const productRoutes = require('./modules/products/routes/product.routes');

const app = express();

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use(express.static('public')); 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor Modular corriendo en puerto ${PORT}`);
});