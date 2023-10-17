const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  id: {type: String},
  chainId: {type: Number},
  timestamp: { type: String },
  account: {type: String},
  from: {type: String},
  to: {type: String},
  amountIn: {type: String},
  realAmount: {type: Number},
  amountOut: {type: String},
  type: {type: String},
  symbol: {type: String},
  leverage: {type: String},
  markPrice: {type: String},
  entryPrice: {type: String},
  status: {type: Number},
});

const OrderModel = mongoose.model('OrderModel', orderSchema, 'order');
module.exports = OrderModel;
