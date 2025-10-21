require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const BASE_MAINNET_RPC = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

module.exports = {
  solidity: '0.8.20',
  networks: {
    base: {
      url: BASE_MAINNET_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.BASESCAN_API_KEY
  }
};
