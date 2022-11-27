const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
BandSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('bands', BandSchema);
