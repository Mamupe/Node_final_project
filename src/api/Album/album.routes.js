const AlbumRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');

const {
  getAlbums,
  getAlbum,
  postAlbum,
  patchAlbum,
  removeAlbum,
  getByTitle,
  getByYear,
} = require('./album.controller');

AlbumRoutes.get('/', getAlbums);
AlbumRoutes.get('/:id', getAlbum);
AlbumRoutes.post('/', upload.single('image'), [isAuth], postAlbum);
AlbumRoutes.patch('/:id', upload.single('image'), [isAuth], patchAlbum);
AlbumRoutes.delete('/:id', [isAuth], removeAlbum);
AlbumRoutes.get('/title/:title', getByTitle);
AlbumRoutes.get('/year/:year', getByYear);

module.exports = AlbumRoutes;
