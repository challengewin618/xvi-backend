const mongoose = require('mongoose');

const { Schema } = mongoose;

const positionStatesSchema = new Schema({
  totalActivePositions: { type: Number },
  totalShortPositionCollaterals: { type: String },
  totalShortPositionSizes: { type: String },
  liquidationsStatus: { type: String },
  totalLongPositionCollaterals: { type: String },
  totalLongPositionSizes: { type: String },
});

const PositionStatesModel = mongoose.model('PositionStatesModel', positionStatesSchema, 'position_stats');
module.exports = PositionStatesModel;
