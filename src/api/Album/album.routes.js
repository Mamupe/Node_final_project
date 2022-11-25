const AlbumRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

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
 *
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
AlbumRoutes.post('/', upload.single('image'), [isAuth], postAlbum);
AlbumRoutes.patch('/:id', upload.single('image'), [isAdmin], patchAlbum);
AlbumRoutes.delete('/:id', [isAdmin], removeAlbum);
AlbumRoutes.get('/title/:title', getByTitle);
AlbumRoutes.get('/year/:year', getByYear);

module.exports = AlbumRoutes;
