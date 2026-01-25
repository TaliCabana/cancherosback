import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from '../src/routes/index.routes.js';
import dbConnection from '../src/config/dbConfig.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api', router);

// DB
await dbConnection();

// VERCEL: NO listen
export default app;
