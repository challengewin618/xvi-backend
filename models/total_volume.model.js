const mongoose = require('mongoose');

const { Schema } = mongoose;

const totalVolumeSchema = new Schema({
  id: { type: String },
  data: {
    timestamp: { type: String },
    token: { type: String },
    action: { type: String },
    volume: { type: String },
  },
});

const TotalVolumeModel = mongoose.model('TotalVolumeModel', totalVolumeSchema, 'total_volume');
module.exports = TotalVolumeModel;
