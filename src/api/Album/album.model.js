const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    band: { type: mongoose.Schema.Types.ObjectId, ref: 'bands' },
    year: { type: Number },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('albums', AlbumSchema);
