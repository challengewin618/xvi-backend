const express = require("express");
const axios = require("axios");

const app = express();
const TotalVolumeModel = require("../models/total_volume.model");
const HourlyVolumeModel = require("../models/hourly_volume.model");
const DailyVolumeModel = require("../models/daily_volume.model");
const PositionStatesModel = require("../models/position_stats.model");
const {useCoingeckoPrices} = require("../utils/prices");
const RoundDataModel = require("../models/round_data.model");
const {Constants} = require("../config/constants");

app.get('/insert_total_volume', (req, res) => {
  axios.get('https://gambit-server-devnet.uc.r.appspot.com/total_volume')
    .then((response) => {
      for (const item of response.data) {
        const model = new TotalVolumeModel(item);
        model.save((err) => {
          if (err) res.status(500).json(err);
        });
      }
      res.json('success');
    }).catch((error) => {
    res.status(500).json(error);
  });
});

app.get('/insert_hourly_volume', (req, res) => {
  axios.get('https://gambit-server-devnet.uc.r.appspot.com/hourly_volume')
    .then((response) => {
      for (const item of response.data) {
        const model = new HourlyVolumeModel(item);
        model.save((err) => {
          if (err) res.status(500).json(err);
          // saved!
        });
      }
      res.json('success');
    }).catch((error) => {
    res.status(500).json(error);
  });
});

app.get('/insert_daily_volume', (req, res) => {
  axios.get('https://gambit-server-devnet.uc.r.appspot.com/daily_volume')
    .then((response) => {
      for (const item of response.data) {
        const model = new DailyVolumeModel(item);
        model.save((err) => {
          if (err) res.status(500).json(err);
          // saved!
        });
      }
      res.json('success');
    }).catch((error) => {
    res.status(500).json(error);
  });
});

app.get('/insert_position_stats', (req, res) => {
  axios.get('https://gambit-server-devnet.uc.r.appspot.com/position_stats')
    .then((response) => {
      const model = new PositionStatesModel(response.data);
      model.save((err) => {
        if (err) res.status(500).json(err);
        // saved!
      });
      res.json('success');
    }).catch((error) => {
    res.status(500).json(error);
  });
});

app.get('/insert_chart_prices/:symbol', async (req, res) => {
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
  const preferableChainId = Number(req.query.preferableChainId);

  let roundData = await useCoingeckoPrices(symbol, 5000);

  for (let i = 0; i < roundData.length; i++) {
    const model = new RoundDataModel({symbol: symbol, value: roundData[i].value, timestamp: roundData[i].timestamp});
    model.save((err) => {
      // saved!
    });
  }

  res.send('success');
});

module.exports = app;
