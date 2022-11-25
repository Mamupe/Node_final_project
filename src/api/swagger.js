const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '1.0.0',
    info: { title: 'Music', version: '1.0.0' },
  },
  apis: ['../api/band/band.routes.js', '../api/band/band.model.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(`Swagger running on port: http://localhost:${port}/api/docs`);
};

module.exports = { swaggerDocs };
