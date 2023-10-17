const {Decimal} = require('decimal.js');
const {Constants} = require('../config/constants');
const ethers = require('ethers');
const PriceFeedABI = require('../abis/PriceFeed.json');
const lodash = require("lodash");
const axios = require("axios");
const {bitQueryApolloClient} = require("../api/apollo");
const {gql} = require("@apollo/client");
const {getPriceHistoryQuery} = require("../api/bitquery");
const {getTokens} = require('../config/Tokens');

function priceToBigNum(price, exponent = 8) {
  return (price * Decimal.pow(10, exponent)).toLocaleString('fullwide', {useGrouping: false})
}

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10,e-1);
      x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10,e);
      x += (new Array(e+1)).join('0');
    }
  }
  return x.toString();
}

function getLastUpdatedTimestamp() {
  return Math.floor(Date.now() / 1000);
}

async function getRoundData(limit, symbol, period, preferableChainId = Constants.DEFAULT_CHAIN_ID) {

  const rpc = lodash.sample(Constants.RPC_PROVIDERS[preferableChainId]);
  const provider = new ethers.providers.JsonRpcProvider(rpc, preferableChainId);

  // Contract Instance
  const priceFeedAddress = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";
  const contract = new ethers.Contract(priceFeedAddress, PriceFeedABI.abi, provider);


// For view function
  const latestRound = await contract.latestRound()
  console.log(latestRound);
  const priceDecimals = 8

  let result = [];
  for (let j = 0; j < limit; j++) {
    const roundData = await contract.getRoundData(latestRound.sub(j))
    const answer = roundData[1]
    const updatedAt = roundData[3]
    result.push({value: ethers.utils.formatUnits(answer, priceDecimals), timestamp: updatedAt});
  }

  return result;
}

async function useCoingeckoPrices(symbol, days) {
  const symbolList = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BUSD: 'binance-usd',
    BNB: 'binancecoin',
    VLX: 'velas'
  }[symbol];

  const url = `https://api.coingecko.com/api/v3/coins/${symbolList}/market_chart?vs_currency=usd&days=${days}&interval=daily`;

  return await axios.get(url)
    .then((response) => {
      return response.data.prices.map((item) => {
        // -1 is for shifting to previous day
        // because CG uses first price of the day, but for GLP we store last price of the day
        return {
          timestamp: item[0] / 1000,
          value: (item[1] * Decimal.pow(10, 8)).toLocaleString('fullwide', {useGrouping: false})
        };
      });
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

function getCoinPrices(response) {
  let result = {};
  // bitcoin
  result['ETH'] = priceToBigNum(response.data.ethereum.usd, 8);
  // ethereum
  result['BTC'] = priceToBigNum(response.data.bitcoin.usd, 8);
  // bnb
  result['BNB'] = priceToBigNum(response.data.binancecoin.usd, 8);
  // busd
  result['BUSD'] = priceToBigNum(response.data.busd.usd, 8);
  // vlx
  result['VLX'] = priceToBigNum(response.data.velas.usd, 8);
  return result;
}

function getCurrentPrice(params) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await bitQueryApolloClient.query({query: gql`${getPriceHistoryQuery(params)}`}))
    } catch (e) {
      reject(e)
    }
  }).then((res) => {
    return res.data.ethereum.dexTrades[0];
  });
}

module.exports = {
  priceToBigNum,
  getRoundData,
  getLastUpdatedTimestamp,
  useCoingeckoPrices,
  getCurrentPrice,
  getCoinPrices,
  toFixed
}
