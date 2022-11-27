const Band = require('./band.model');

const { setError } = require('../../helpers/error/handle.error');
const { deleteFile } = require('../../middlewares/delete-file');

const getBands = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const bands = await Band.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    return res.json({
      status: 200,
      message: 'Recovered all Bands',
      data: { bands },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover bands'));
  }
};

const getBand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);
    res.status(200).json(band);
  } catch (error) {
    return next(error);
  }
};

const postBand = async (req, res, next) => {
  try {
    const band = new Band(req.body);
    if (req.file) {
      band.image = req.file.path;
    }
    const bandInDB = await band.save();
    return res.status(201).json({
      message: 'Band created',
      bandInDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in band creation'));
  }
};

const patchBand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patchBandDB = new Band(req.body);

    patchBandDB._id = id;
    const bandDB = await Band.findByIdAndUpdate(id, patchBandDB);

    if (req.file) {
      deleteFile(bandDB.image);
      patchBandDB.image = req.file.path;
    }

    if (!bandDB) {
      return next('Band not found');
    }
    return res.status(200).json({
      new: patchBandDB,
      old: bandDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in band update'));
  }
};

const removeBand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBand = await Band.findByIdAndDelete(id);
    if (deletedBand.image) {
      deleteFile(deletedBand.image);
    }
    if (!deletedBand) {
      return next(setError(404, 'Band not found'));
    }
    return res.status(200).json({
      message: 'Band deleted',
      deletedBand,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in Band deletion'));
  }
};

const getByName = async (req, res) => {
  const { name } = req.params;

  try {
    const bandByName = await Band.find({ name: name });
    return res.status(200).json(bandByName);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getByStyle = async (req, res) => {
  const { style } = req.params;

  try {
    const bandByStyle = await Band.find({ style: style });
    return res.status(200).json(bandByStyle);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getByCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const bandByCountry = await Band.find({ country: country });
    return res.status(200).json(bandByCountry);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getBands,
  getBand,
  postBand,
  patchBand,
  removeBand,
  getByName,
  getByStyle,
  getByCountry,
};
