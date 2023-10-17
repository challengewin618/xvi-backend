const Constants = {
  BSC: 56,
  BSC_TESTNET: 97,
  VELAS: 111,
  ETHEREUM: 1,
  DEFAULT_NETWORK: 'bsc_testnet',
  DEFAULT_CHAIN_ID: 97,
  SIGNER: "05c47435e88b337abee7e02f34bcd9567b5899892c0bb3f525df67f3882d98fd",
  CHAINLINK: "0x1a9900400f6d3a2c8af7c98541754aa163d9f01d",
  RPC_PROVIDERS: {
    97: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-2-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://data-seed-prebsc-2-s3.binance.org:8545',
    ],
    111: [
      'https://api.testnet.velas.com'
    ],
  },
  VALID_CHAINS: [1, 97, 111],
  VALID_SYMBOLS: ['BTC', 'ETH', 'BNB', 'BUSD', 'VLX'],
  NETWORKS: {
    1: 'ethereum',
    97: 'bsc',
    111: 'velas'
  },
  BITQUERY_GQL_URL: 'https://graphql.bitquery.io',
  X_API_KEY: 'BQYioKvYyGfLWaoVltBo5JRA9vst90dJ',
  VALID_PERIODS: new Set(Object.keys({
    '5m': 60 * 5,
    '15m': 60 * 15,
    '1h': 60 * 60,
    '4h': 60 * 60 * 4,
    '1d': 60 * 60 * 24,
  }))
};

module.exports = {Constants};
