const BandRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');
/**
 * @swagger
 * components:
 *   schemas:
 *     band:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         style:
 *           type: string
 *         country:
 *           type: string
 *         image:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const {
  getBands,
  getBand,
  postBand,
  patchBand,
  removeBand,
  getByName,
  getByStyle,
  getByCountry,
} = require('./band.controller');
/**
 * @swagger
 * /api/bands:
 *   get:
 *     summary: Get all bands
 *     tags: [bands]
 *     description: Get all bands
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/', getBands);
/**
 * @swagger
 * /api/bands/{id}:
 *   get:
 *     summary: return a band
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get a band
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/:id', getBand);
/**
 * @swagger
 * /api/bands:
 *   post:
 *     summary: Post a new band
 *     tags: [bands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/band"
 */
BandRoutes.post('/', upload.single('image'), [isAuth], postBand);
/**
 * @swagger
 * /api/bands/{id}:
 *   patch:
 *     summary: edit a band
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: edit a band
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/band"
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.patch('/:id', upload.single('image'), [isAdmin], patchBand);
/**
 * @swagger
 * /api/bands/{id}:
 *   delete:
 *     summary: delete a band
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: delete a band
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.delete('/:id', removeBand);
/**
 * @swagger
 * /api/bands/name/{name}:
 *   get:
 *     summary: Get a band by name
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: name
 *     description: Get a band by name
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/name/:name', getByName);
/**
 * @swagger
 * /api/bands/style/{style}:
 *   get:
 *     summary: Get a band by style
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: style
 *     description: Get a band by style
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/style/:style', getByStyle);
/**
 * @swagger
 * /api/bands/country/{country}:
 *   get:
 *     summary: Get a band by country
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: country
 *     description: Get a band by country
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/country/:country', getByCountry);

module.exports = BandRoutes;
