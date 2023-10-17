const getPriceHistoryQuery = (params) => `{
  ethereum(network: ${params.network}) {
    dexTrades(
      options: {limit: 1, desc: "block.timestamp.unixtime"}
      baseCurrency: {is: "${params.baseCurrency}"}
      quoteCurrency: {is: "${params.quoteCurrency}"}
    ) {
      quotePrice
      block {
        timestamp {
          unixtime
        }
      }
    }
  }
}`

module.exports = {getPriceHistoryQuery};
