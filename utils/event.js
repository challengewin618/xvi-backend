const ethers = require("ethers");
const abi = require("../abis/OrderBookNew.json");
const {Constants} = require("../config/constants");
const {getContract} = require("../config/Addresses");
const OrderModel = require("../models/order.model");
const {getLastUpdatedTimestamp} = require("./prices");
const {getToken} = require("../config/Tokens");
const RoundDataModel = require("../models/round_data.model");

function setupListener() {
  const chainId = Constants.BSC_TESTNET;
  const orderBookAddress = getContract(chainId, "OrderBook");
  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
  const contract = new ethers.Contract(orderBookAddress, abi.output.abi, provider);

  contract.on("eventCreateOrder",
    async (id,
           account,
           from,
           amountIn,
           to,
           leverage,
           amountOut,
           isLong
    ) => {
      const symbol = getToken(chainId, from).symbol;

      const entryPrice = await getCurrentPrice(symbol);

      const entryRealPrice = ethers.utils.formatUnits(ethers.BigNumber.from(entryPrice), 8);
      const size = ethers.utils.formatUnits(ethers.BigNumber.from(amountIn), 18);

      const model = new OrderModel({
        id: ethers.BigNumber.from(id).toString(),
        timestamp: getLastUpdatedTimestamp(),
        account: account,
        chainId: chainId,
        from: from,
        to: to,
        symbol: symbol,
        realAmount: entryRealPrice * size,
        leverage: ethers.BigNumber.from(leverage).toString(),
        amountIn: ethers.BigNumber.from(amountIn).toString(),
        amountOut: ethers.BigNumber.from(amountOut).toString(),
        type: isLong ? "Long" : "Short",
        status: 1,
        entryPrice: entryPrice,
        markPrice: 0
      });

      await model.save();
    });

  contract.on("eventUpdateOrder",
    async (
      id,
      account,
      leverage
    ) => {
      await OrderModel.updateOne({id: ethers.BigNumber.from(id).toString(), account: account}, {leverage: ethers.BigNumber.from(leverage).toString()});
    });

  contract.on("eventExecuteOrder",
    async (
       account,
       id
    ) => {
      await OrderModel.updateOne({id: ethers.BigNumber.from(id).toString(), account: account}, {status: 0});
    });

  contract.on("eventSwap", async (
      account,
      from,
      to,
      amountIn,
      amountOut
  ) => {
    const symbol = getToken(chainId, from).symbol;

    const entryPrice = await getCurrentPrice(symbol);
    const entryRealPrice = ethers.utils.formatUnits(ethers.BigNumber.from(entryPrice), 8);
    const size = ethers.utils.formatUnits(ethers.BigNumber.from(amountIn), 18);

    const model = new OrderModel({
      id: "0",
      timestamp: getLastUpdatedTimestamp(),
      account: account,
      chainId: chainId,
      from: from,
      to: to,
      symbol: symbol,
      realAmount: entryRealPrice * size,
      leverage: "0",
      amountIn: ethers.BigNumber.from(amountIn).toString(),
      amountOut: ethers.BigNumber.from(amountOut).toString(),
      type: "Swap",
      status: 0,
      entryPrice: entryPrice,
      markPrice: 0
    });

    await model.save();
  });
}

async function getCurrentPrice(symbol) {
  const result = await RoundDataModel.find({'symbol': symbol}, ['value'], {
    skip: 0,
    limit: 1,
    sort: {'timestamp': -1}
  });
  if (result.length > 0) {
    return result[0].value;
  }
  return 0;
}

module.exports = {setupListener};
