const express = require('express');
const axios = require('axios');

const app = express();
const lodash = require('lodash');
const TotalVolumeModel = require('../models/total_volume.model');
const DailyVolumeModel = require('../models/daily_volume.model');
const HourlyVolumeModel = require('../models/hourly_volume.model');
const PositionStatesModel = require('../models/position_stats.model');
const {Constants} = require('../config/constants');
const ethers = require("ethers");
const ChainLinkABI = require("../abis/Chainlink.json");
const {getRoundData, getLastUpdatedTimestamp, getCurrentPrice} = require("../utils/prices");
const {bitqueryTokenAddress} = require("../config/Tokens");

app.get('/total_volume', (req, res) => {
  TotalVolumeModel.find((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/hourly_volume', (req, res) => {
  HourlyVolumeModel.find((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/daily_volume', (req, res) => {
  DailyVolumeModel.find((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/position_stats', (req, res) => {
  PositionStatesModel.findOne({}, '-_id -__v', (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/ui_version', (req, res) => {
  res.send('1.3');
});

app.post('/provider/:chainId', async (req, res) => {
  const provider = lodash.sample(Constants.RPC_PROVIDERS[req.params.chainId]);
  await axios.post(provider, req, {
    headers: {
      'content-type': 'application/json',
    },
  }).then((result) => {
    res.send(result.data);
  }).catch((error) => {
    res.status(500).json(error);
  });
});

app.get('/chart_prices_chainlink/:symbol', async (req, res) => {
  const period = req.query.period?.toLowerCase();

  if (!period || !Constants.VALID_PERIODS.has(period)) {
    res.status(400).send(`Invalid period. Valid periods are ${Array.from(Constants.VALID_PERIODS)}`);
    return;
  }

  const validSymbols = new Set(['BTC', 'ETH', 'BNB', 'USDG', 'VLX']);
  const {symbol} = req.params;
  if (!validSymbols.has(symbol)) {
    res.status(400).send(`Invalid symbol ${symbol}`);
  }
  const preferableChainId = Number(req.query.preferableChainId);

  let prices;
  try {
    prices = await getRoundData(5000, req.params.symbol, period, preferableChainId);
  } catch (ex) {
    res.status(500).send(ex);
    return;
  }

  res.set('Cache-Control', 'max-age=60');
  res.send({
    prices, period, updatedAt: getLastUpdatedTimestamp(),
  });
});

setInterval(function () {
  // timer();
}, 300000);

async function timer() {
  for (const chainId of Constants.VALID_CHAINS) {
    for (const symbol of Object.keys(bitqueryTokenAddress[chainId])) {
      let params = {
        network: Constants.NETWORKS[chainId],
        baseCurrency: bitqueryTokenAddress[chainId][symbol], //wvlx
        quoteCurrency: bitqueryTokenAddress[chainId]['USD'] //usdc
      };

      getCurrentPrice(params).then(async (response) => {
        await transmit(chainId, response.data.ethereum.dexTrades[0].quotePrice);
      }).catch((err) => {
        res.status(500).send(err);
      });
    }
  }
}

async function transmit(chainId, price) {
  let rpc = lodash.sample(Constants.RPC_PROVIDERS[chainId]);
  let provider = new ethers.providers.JsonRpcProvider(rpc, chainId);

  const signer = new ethers.Wallet(Constants.SIGNER, provider);

  let contract = new ethers.Contract(Constants.CHAINLINK, ChainLinkABI.abi, signer);

  await contract.transmit(price);
}

module.exports = app;
