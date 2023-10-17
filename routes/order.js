const express = require('express');
const axios = require('axios');
const OrderModel = require('../models/order.model');
const app = express();

app.get('/position_list', (req, res) => {
  OrderModel.find({
    account: req.query.account,
    chainId: req.query.chainId,
    $or: [{type: "Long"}, {type: "Short"}],
    status: 1,
  }, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/total_data', async (req, res) => {
  const result = {};

  const totalTradingResult = await OrderModel.aggregate([
    {$project: {_id: 0, realAmount: 1}}
  ]);

  const openInterestResult = await OrderModel.aggregate([
    {$match: {status: 1} },
    {$project: {_id: 0, realAmount: 1}}
  ]);

  const totalUsersResult = await OrderModel.aggregate([
    {$group: {_id: '$account', count: {$sum: 1}}}
  ]);

  result.totalTradingVolume = totalTradingResult.length ? totalTradingResult[0].realAmount : 0;
  result.openInterest = openInterestResult.length ? openInterestResult[0].realAmount : 0;
  result.totalUsers = totalUsersResult.length ? totalUsersResult[0].count : 0;

  res.json(result);
});

module.exports = app;
