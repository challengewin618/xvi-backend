const ethers = require('ethers');
const { getContract } = require('./Addresses');

const TOKENS = {
  56: [
    {
      name: 'Bitcoin (BTCB)',
      symbol: 'BTC',
      decimals: 18,
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      coingeckoUrl: 'https://www.coingecko.com/en/coins/binance-bitcoin',
      imageUrl: 'https://assets.coingecko.com/coins/images/14108/small/Binance-bitcoin.png',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      coingeckoUrl: 'https://www.coingecko.com/en/coins/ethereum',
      imageUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      address: ethers.constants.AddressZero,
      coingeckoUrl: 'https://www.coingecko.com/en/coins/binance-coin',
      imageUrl: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png',
      isNative: true,
    },
    {
      name: 'Wrapped Binance Coin',
      symbol: 'WBNB',
      decimals: 18,
      address: getContract(56, 'NATIVE_TOKEN'),
      isWrapped: true,
      coingeckoUrl: 'https://www.coingecko.com/en/coins/binance-coin',
      imageUrl: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png',
      baseSymbol: 'BNB',
    },
    {
      name: 'USD Gambit',
      symbol: 'USDG',
      decimals: 18,
      address: getContract(56, 'USDG'),
      isUsdg: true,
      coingeckoUrl: 'https://www.coingecko.com/en/coins/usd-gambit',
      imageUrl: 'https://assets.coingecko.com/coins/images/15886/small/usdg-02.png',
    },
    {
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      isStable: true,
      coingeckoUrl: 'https://www.coingecko.com/en/coins/binance-usd',
      imageUrl: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      isStable: true,
      coingeckoUrl: 'https://www.coingecko.com/en/coins/usd-coin',
      imageUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      decimals: 18,
      address: '0x55d398326f99059fF775485246999027B3197955',
      isStable: true,
      coingeckoUrl: 'https://www.coingecko.com/en/coins/tether',
      imageUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png',
    },
  ],
  97: [
    {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
    },
    {
      name: 'Wrapped Binance Coin',
      symbol: 'WBNB',
      decimals: 18,
      address: '0x612777Eea37a44F7a95E3B101C39e1E2695fa6C2',
      isWrapped: true,
      baseSymbol: 'BNB',
    },
    {
      name: 'Bitcoin (BTCB)',
      symbol: 'BTC',
      decimals: 8,
      address: '0xD0012417C1b2CeB51a34a6774e3389F86863fb9a',
      isShortable: true,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: '0x54759f7b3D68c211ffb403262f079d9eAd65CD68',
      isShortable: true,
    },
    {
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      address: '0xD0cb965cB56d884ea04C12CeFc2417504d12a73c',
      isStable: true,
      isShortable: true,
    },
  ],
  111: [
    {
      name: 'Velas',
      symbol: 'VLX',
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
    },
    {
      name: 'Wrapped Velas',
      symbol: 'WVLX',
      decimals: 18,
      isWrapped: true,
      baseSymbol: 'VLX',
    },
    {
      name: 'Bitcoin (BTCB)',
      symbol: 'BTC',
      decimals: 8,
      address: '0xb19C12715134bee7c4b1Ca593ee9E430dABe7b56',
      isShortable: true,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: '0x1958f7C067226c7C8Ac310Dc994D0cebAbfb2B02',
      isShortable: true,
    },
  ],
};

const tokenAddress = {
  97: {
    'BNB': '0x0000000000000000000000000000000000000000',
    'BTC': '0xD0012417C1b2CeB51a34a6774e3389F86863fb9a',
    'ETH': '0x54759f7b3D68c211ffb403262f079d9eAd65CD68',
    'BUSD': '0xD0cb965cB56d884ea04C12CeFc2417504d12a73c',
  },
  111: {
    'VLX': '0x612777Eea37a44F7a95E3B101C39e1E2695fa6C2',
    'BTC': '0xb19C12715134bee7c4b1Ca593ee9E430dABe7b56',
    'ETH': '0x1958f7C067226c7C8Ac310Dc994D0cebAbfb2B02',
    'BUSD': '0x3F223C4E5ac67099CB695834b20cCd5E5D5AA9Ef',
  },
};

const bitqueryTokenAddress = {
  1: {
    'BTC': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    'ETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'USD': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  },
  97: {
    'BNB': '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    'BUSD': '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    'USD': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  },
  111: {
    'VLX': '0xc579d1f3cf86749e05cd06f7ade17856c2ce3126',
    'USD': '0x01445c31581c354b7338ac35693ab2001b50b9ae',
    // 'WAG': '0xaBf26902Fd7B624e0db40D31171eA9ddDf078351',
    // 'PLSPAD': '0x8a74BC8c372bC7f0E9cA3f6Ac0df51BE15aEC47A',
    // 'USDV': '0xcd7509b76281223f5b7d3ad5d47f8d7aa5c2b9bf'
  }
}

function getTokens(chainId) {
  return TOKENS[chainId];
}

const CHAIN_IDS = [97, 111];
const TOKENS_MAP = {};

for (let j = 0; j < CHAIN_IDS.length; j++) {
  const chainId = CHAIN_IDS[j];
  TOKENS_MAP[chainId] = {};
  let tokens = TOKENS[chainId];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    TOKENS_MAP[chainId][token.address] = token;
  }
}

function getToken(chainId, address) {
  return TOKENS_MAP[chainId][address];
}

module.exports = {tokenAddress, bitqueryTokenAddress, getTokens, getToken};
