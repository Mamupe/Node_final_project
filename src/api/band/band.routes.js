const BandRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');

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

BandRoutes.get('/', getBands);
BandRoutes.get('/:id', getBand);
BandRoutes.post('/', upload.single('image'), [isAuth], postBand);
BandRoutes.patch('/:id', upload.single('image'), [isAuth], patchBand);
BandRoutes.delete('/:id', [isAuth], removeBand);
BandRoutes.get('/name/:name', getByName);
BandRoutes.get('/style/:style', getByStyle);
BandRoutes.get('/country/:country', getByCountry);

module.exports = BandRoutes;
