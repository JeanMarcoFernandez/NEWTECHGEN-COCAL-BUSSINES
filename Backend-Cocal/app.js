import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import autenticacionRutas from './routes/authRoutes.js';
import usuariosRutas from './routes/usuarios.js';
import usuariosAdminRoutes from './routes/usuariosAdminRoutes.js';
import cambiarContrasenaRoutes from './routes/cambiarContrasenaRoutes.js';
import { configurarSwagger } from './swagger.js';
import seguridadRoutes from './routes/seguridadRoutes.js';
import auditoriaRoutes from './routes/auditoriaRoutes.js';
import twoFactorRoutes from "./routes/twoFactorRoutes.js";
import restablecerContrasenaRoutes from './routes/restablecerContrasenaRoutes.js';
import proyectosMiembrosRoutes from './routes/proyectosMiembrosRoutes.js';
import miembrosProyectoRoutes from './routes/miembrosProyectoRoutes.js';
import usuariosMiembrosRoutes from './routes/usuariosMiembrosRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import departamentoRoutes from './routes/departamentoRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import administracionEmpresaDepartamentoRoutes from './routes/administracionEmpresaDepartamentoRoutes.js';
import calendarioUsuarioRoutes from './routes/calendarioUsuarioRoutes.js';
import calendarioEmpresaRoutes from './routes/calendarioEmpresaRoutes.js';
import calendarioDepartamentoRoutes from './routes/calendarioDepartamentoRoutes.js';
import calendarioVinculoRoutes from './routes/calendarioVinculoRoutes.js';
import recursoRoutes from './routes/recursoRoutes.js';
import reservaRecursoRoutes from './routes/reservaRecursoRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import recurso15Routes from './routes/recurso15Routes.js';
import mantenimientoRoutes from './routes/mantenimientoRoutes.js';

import permisoRoutes from './routes/permisoRoutes.js';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.set('trust proxy', 1);
// Rutas principales
app.use('/api/auth', autenticacionRutas);
app.use('/api/usuarios', usuariosRutas);
app.use('/api/usuarios-admin', usuariosAdminRoutes);
app.use('/api/contrasena', cambiarContrasenaRoutes);
app.use('/api/seguridad', seguridadRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use("/api/auth", twoFactorRoutes);
app.use('/api/contrasena', restablecerContrasenaRoutes);
app.use('/api/proyectos-miembros', proyectosMiembrosRoutes);
app.use('/api/miembros-proyecto', miembrosProyectoRoutes);
app.use('/api/usuarios-miembros', usuariosMiembrosRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/admin/empresa-departamento', administracionEmpresaDepartamentoRoutes);
app.use('/api/calendarios/usuario', calendarioUsuarioRoutes);
app.use('/api/calendarios/empresa', calendarioEmpresaRoutes);
app.use('/api/calendarios/departamento', calendarioDepartamentoRoutes);
app.use('/api/calendarios/vinculos', calendarioVinculoRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/reservas-recursos', reservaRecursoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recurso15', recurso15Routes);
app.use('/api/mantenimiento', mantenimientoRoutes);
app.use('/api/permisos', permisoRoutes);
//Swagger
configurarSwagger(app);


export default app;
