const express = require('express');
const axios = require('axios');

const app = express();
const RoundDataModel = require('../models/round_data.model');
const {Constants} = require("../config/constants");
const {tokenAddress, bitqueryTokenAddress} = require("../config/Tokens");
const {priceToBigNum, getLastUpdatedTimestamp} = require("../utils/prices.js");
const {getCurrentPrice, getCoinPrices, toFixed} = require("../utils/prices");

app.get('/chart_prices/:symbol', async (req, res) => {
  const period = req.query.period?.toLowerCase();

  if (!period || !Constants.VALID_PERIODS.has(period)) {
    res.status(400).send(`Invalid period. Valid periods are ${Array.from(Constants.VALID_PERIODS)}`);
    return;
  }

  const validSymbols = new Set(['BTC', 'ETH', 'BNB', 'BUSD', 'VLX']);
  const {symbol} = req.params;
  if (!validSymbols.has(symbol)) {
    res.status(400).send(`Invalid symbol ${symbol}`);
  }

  RoundDataModel.find({'symbol': symbol}, ['value', 'timestamp'], {
    skip: 0,
    limit: 5000,
    sort: {'timestamp': -1}
  }, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send({
        prices: result,
        period: period,
        updatedAt: getLastUpdatedTimestamp(),
      });
    }
  });
});


app.get('/coin_prices/', async (req, res) => {
  const result = {};

  for (const chainId of Constants.VALID_CHAINS) {
    for (const symbol of Object.keys(bitqueryTokenAddress[chainId])) {
      if (symbol !== 'USD') {
        let params = {
          network: Constants.NETWORKS[chainId],
          baseCurrency: bitqueryTokenAddress[chainId][symbol], //wvlx
          quoteCurrency: bitqueryTokenAddress[chainId]['USD'] //usdc
        };

        const tmp = await getCurrentPrice(params);
        result[tokenAddress[chainId][symbol]] = toFixed(tmp.quotePrice);
      }
    }
  }

  res.send(result);
});

app.get('/prices/:chainId', async (req, res) => {
  const param_chainId = req.params.chainId;
  const result = {};

  for (const chainId of Constants.VALID_CHAINS) {
    for (const symbol of Object.keys(bitqueryTokenAddress[chainId])) {
      if (symbol !== 'USD') {
        let params = {
          network: Constants.NETWORKS[chainId],
          baseCurrency: bitqueryTokenAddress[chainId][symbol], //wvlx
          quoteCurrency: bitqueryTokenAddress[chainId]['USD'] //usdc
        };

        const tmp = await getCurrentPrice(params);
        result[tokenAddress[param_chainId][symbol]] = priceToBigNum(tmp.quotePrice, 0);
      }
    }
  }

  res.send(result);
});

setInterval(function () {
  insert_coingecko_price();
  // insert_bitquery_price();
}, 300000);

function insert_coingecko_price() {
  axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,busd,velas&vs_currencies=usd')
    .then((response) => {
      console.log(response);
      const price = getCoinPrices(response);
      for (const symbol of Constants.VALID_SYMBOLS) {
        const model = new RoundDataModel({symbol: symbol, value: price[symbol], timestamp: getLastUpdatedTimestamp()});
        model.save((result) => {
        });
      }
    }).catch((err) => {
    console.log('Error', err);
  });
}

async function insert_bitquery_price() {
  for (const chainId of Constants.VALID_CHAINS) {
    for (const symbol of Object.keys(bitqueryTokenAddress[chainId])) {
      if (symbol !== 'USD') {
        let params = {
          network: Constants.NETWORKS[chainId],
          baseCurrency: bitqueryTokenAddress[chainId][symbol], //wvlx
          quoteCurrency: bitqueryTokenAddress[chainId]['USD'] //usdc
        };

        const result = await getCurrentPrice(params);
        const model = new RoundDataModel({
          symbol: symbol,
          value: priceToBigNum(result.quotePrice, 8),
          timestamp: result.block.timestamp.unixtime
        });
        model.save((result) => {
          //success
        });
      }
    }
  }
}

module.exports = app;
