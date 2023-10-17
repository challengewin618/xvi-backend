const mongoose = require('mongoose');

const { Schema } = mongoose;

const dailyVolumeSchema = new Schema({
  id: { type: String },
  data: {
    timestamp: { type: String },
    token: { type: String },
    action: { type: String },
    volume: { type: String },
  },
});

const DailyVolumeModel = mongoose.model('DailyVolumeModel', dailyVolumeSchema, 'daily_volume');
module.exports = DailyVolumeModel;
