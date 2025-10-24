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
        'Documentación oficial del backend de COCAL Business.\n\nIncluye los módulos de **autenticación**, **usuarios**, y próximamente **calendarios** y **eventos**.\n\nUsa el botón 🔒 "Authorize" para probar las rutas protegidas con tu token JWT.',
      contact: {
        name: 'Equipo de Desarrollo COCAL',
        email: 'cocal.business@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Servidor local de desarrollo',
      },
    ],

    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Introduce tu token JWT aquí para acceder a las rutas protegidas.\n\nFormato: **Bearer &lt;tu_token&gt;**',
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(opciones);

export function configurarSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    ` Swagger listo en: http://localhost:${process.env.PORT}/api/docs`
  );
}
