const mongoose = require('mongoose');

const { Schema } = mongoose;

const hourlyVolumeSchema = new Schema({
  id: { type: String },
  data: {
    timestamp: { type: String },
    token: { type: String },
    action: { type: String },
    volume: { type: String },
  },
});

const HourlyVolumeModel = mongoose.model('HourlyVolumeModel', hourlyVolumeSchema, 'hourly_volume');
module.exports = HourlyVolumeModel;
