const AlbumRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     album:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         band:
 *           type: string
 *         year:
 *           type: number
 *         image:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const {
  getAlbums,
  getAlbum,
  postAlbum,
  patchAlbum,
  removeAlbum,
  getByTitle,
  getByYear,
} = require('./album.controller');

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: return a album
 *     tags: [albums]
 *     description: Get all albums
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: objet
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/album"
 */
AlbumRoutes.get('/', getAlbums);
/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: return a album
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get a album
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.get('/:id', getAlbum);
/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: post an album
 *     security:
 *      -bearerAuth: []
 *     tags: [albums]
 *     description: Lets a user post a new album
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/album"
 */

AlbumRoutes.post('/', upload.single('image'), [isAuth], postAlbum);
/**
 * @swagger
 * /api/albums/{id}:
 *   patch:
 *     summary: edit an album
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: edit an album
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/album"
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.patch('/:id', upload.single('image'), [isAdmin], patchAlbum);
/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: delete a album
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: delete a album
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.delete('/:id', [isAdmin], removeAlbum);
/**
 * @swagger
 * /api/albums/title/{title}:
 *   get:
 *     summary: Get a band by title
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: title
 *     description: Get a band by title
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.get('/title/:title', getByTitle);
/**
 * @swagger
 * /api/bands/year/{year}:
 *   get:
 *     summary: Get a band by year
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         number: number
 *     description: Get a band by year
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.get('/year/:year', getByYear);

module.exports = AlbumRoutes;
