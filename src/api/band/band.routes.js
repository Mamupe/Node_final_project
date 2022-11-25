const BandRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

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
 *     summary: return a band
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
 *     security:
 *      -bearerAuth: []
 *     tags: [bands]
 *     description: Lets a user post a new band
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - style
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               style:
 *                 type: string
 *               country:
 *                 type: string
 *               image:
 *                 type: string
 */
BandRoutes.post('/', upload.single('image'), [isAuth], postBand);
BandRoutes.patch('/:id', upload.single('image'), [isAdmin], patchBand);
BandRoutes.delete('/:id', [isAdmin], removeBand);
BandRoutes.get('/name/:name', getByName);
BandRoutes.get('/style/:style', getByStyle);
BandRoutes.get('/country/:country', getByCountry);

module.exports = BandRoutes;
