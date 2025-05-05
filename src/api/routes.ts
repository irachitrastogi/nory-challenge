import { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import locationRoutes from './routes/locationRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import reportRoutes from './routes/reportRoutes';
import menuRoutes from './routes/menuRoutes';

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

  // API routes
  app.use('/api/locations', locationRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/menu', menuRoutes);

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });
  
  // Default route for API
  app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Weird Salads Inventory API',
      documentation: '/api-docs',
    });
  });
};
