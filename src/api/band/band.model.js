const mongoose = require('mongoose');

const BandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    style: { type: String, required: true },
    country: { type: String },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('bands', BandSchema);
