import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import autenticacionRutas from './routes/authRoutes.js';
import usuariosRutas from './routes/usuarios.js';
import { configurarSwagger } from './swagger.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rutas principales
app.use('/api/auth', autenticacionRutas);
app.use('/api/usuarios', usuariosRutas);

// Documentación Swagger
configurarSwagger(app);

export default app;
