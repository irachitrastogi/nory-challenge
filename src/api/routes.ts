import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

/**
 * Setup all API routes
 */
export const setupRoutes = (app: Express) => {
  // Swagger configuration
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Weird Salads Inventory API',
        version: '1.0.0',
        description: 'API for Weird Salads Inventory Management System',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/api/routes/*.ts'],
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });

  // TODO: Add routes for locations, staff, inventory, etc.
  // These will be implemented as we build out the application
  
  // Default route for API
  app.get('/api', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Weird Salads Inventory API',
      documentation: '/api-docs',
    });
  });
};
