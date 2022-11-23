const Album = require('./album.model');

const { setError } = require('../../helpers/error/handle.error');
const { deleteFile } = require('../../middlewares/delete-file');

const getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find().populate('band');
    return res.json({
      status: 200,
      message: 'Recovered all Albums',
      data: { albums },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover albums'));
  }
};

const getAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate('band');
    res.status(200).json(album);
  } catch (error) {
    return next(error);
  }
};

const postAlbum = async (req, res, next) => {
  try {
    const album = new Album(req.body);
    if (req.file) {
      album.image = req.file.path;
    }
    const albumInDB = await album.save();
    return res.status(201).json({
      message: 'Album created',
      albumInDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in album creation'));
  }
};

const patchAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patchAlbumDB = new Album(req.body);

    patchAlbumDB._id = id;
    const albumDB = await Album.findByIdAndUpdate(id, patchAlbumDB);

    if (req.file) {
      deleteFile(albumDB.image);
      patchAlbumDB.image = req.file.path;
    }

    if (!albumDB) {
      return next('Album not found');
    }
    return res.status(200).json({
      new: albumDB,
      old: albumDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in album update'));
  }
};

const removeAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await Album.findByIdAndDelete(id);
    if (deletedAlbum.image) {
      deleteFile(deletedAlbum.image);
    }
    if (!deletedAlbum) {
      return next(setError(404, 'Album not found'));
    }
    return res.status(200).json({
      message: 'Album deleted',
      deletedAlbum,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in Album deletion'));
  }
};

const getByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const albumByTitle = await Album.find({ title: title });
    return res.status(200).json(albumByTitle);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getByYear = async (req, res) => {
  const { year } = req.params;

  try {
    const albumByYear = await Album.find({ year: { $gt: year } });
    return res.status(200).json(albumByYear);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getAlbums,
  getAlbum,
  postAlbum,
  patchAlbum,
  removeAlbum,
  getByTitle,
  getByYear,
};
