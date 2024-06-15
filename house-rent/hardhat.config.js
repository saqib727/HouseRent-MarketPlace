require('dotenv').config();
const { PRIVATE_KEY, RPC_URL } = process.env;



/** @type import('hardhat/config').HardhatUserConfig */


module.exports = {
  defaultNetwork: "polygon_amoy",
  networks: {
    hardhat: {
      chainId: 80002,
    },
    polygon_amoy: {
      url: RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`]

    }
  },

  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
