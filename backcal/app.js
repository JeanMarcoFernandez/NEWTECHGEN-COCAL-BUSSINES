import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.js';
import empresaRoutes from './routes/empresa.js';
import departamentoRoutes from './routes/departamento.js';
import usuarioRoutes from './routes/usuario.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// manejador de errores simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ ok:false, message: err.message || 'Error interno' });
});

export default app;
