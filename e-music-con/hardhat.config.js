require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "polygon_amnoy",
  networks: {
    xinfin: {
      url: process.env.XDC_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    xinfintestnet: {
      url: process.env.XDC_TESTNET_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    polygon_amnoy: {
      url: process.env.POLYGON_AMNOY_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
