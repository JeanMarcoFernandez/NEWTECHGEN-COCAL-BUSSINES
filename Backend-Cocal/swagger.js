import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const opciones = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API COCAL Business',
      version: '1.0.0',
      description:
        'Documentación oficial del backend de COCAL Business. Contiene los módulos de autenticación, usuarios y próximos calendarios y eventos.',
      contact: {
        name: 'Equipo de Desarrollo COCAL',
        email: 'cocal.business@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Servidor de desarrollo local',
      },
    ],
  },
  apis: ['./rutas/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(opciones);

export function configurarSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📖 Swagger disponible en http://localhost:' + process.env.PORT + '/api/docs');
}
