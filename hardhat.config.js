require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
console.log("process", process.env)
const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY_OWNER

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "amoy",
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    amoy: {
      chainId: 80002,
      url: RPC_URL,
      accounts: [PRIVATE_KEY]
    },
    sepolia: {
      chainID: 11155111,
      url: RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  }
}
