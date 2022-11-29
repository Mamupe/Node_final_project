const express = require('express');
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Musicapi',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [
    `${path.join(__dirname, './api/band/band.routes.js')}`,
    `${path.join(__dirname, './api/album/album.routes.js')}`,
    `${path.join(__dirname, './api/user/user.routes.js')}`,
  ],
};

dotenv.config();

const { connect } = require('./helpers/db/connect');
const { setUpCloudinary } = require('./helpers/cloudinary/cloudinary');

const BandRoutes = require('./api/band/band.routes');
const UserRoutes = require('./api/user/user.routes');
const AlbumRoutes = require('./api/album/album.routes');

const { setError } = require('./helpers/error/handle.error');

connect();
setUpCloudinary();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use(compression());

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.set('secretKey', process.env.SECRET_KEY_JWT);

app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

app.use('/api/users', UserRoutes);
app.use('/api/bands', BandRoutes);
app.use('/api/albums', AlbumRoutes);

app.use('*', (req, res, next) => next(setError(404, 'Route not found')));

app.use((error, req, res) => {
  return res.status(error.status || 500).json(error.message || 'Unexpected error');
});

app.disable('x-powered-by');

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT}`);
});
