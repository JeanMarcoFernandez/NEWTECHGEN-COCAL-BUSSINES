// Back/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import usuariosRutas from './routes/usuarios.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRutas);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API COCAL Business funcionando correctamente 🚀',
  });
});

export default app;
