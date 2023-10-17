const mongoose = require('mongoose');

const { Schema } = mongoose;

const roundDataSchema = new Schema({
  symbol: { type: String },
  timestamp: { type: String },
  value: { type: String }
});

const RoundDataModel = mongoose.model('RoundDataModel', roundDataSchema, 'round_data');
module.exports = RoundDataModel;
