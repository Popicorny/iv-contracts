import "@nomiclabs/hardhat-waffle";
import "hardhat-log-remover";
import "@nomiclabs/hardhat-ethers";
import "solidity-coverage";

require("dotenv").config();

process.env.TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

// Defaults to CHAINID=1 so things will run with mainnet fork if not specified
const CHAINID = process.env.CHAINID ? + process.env.CHAINID : 1;

export default {
  accounts: {
    mnemonic: process.env.TEST_MNEMONIC,
  },
  solidity: {
    version: "0.7.2",
    settings: {
      optimizer: {
        runs: 200,
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.TEST_MNEMONIC,
      },
      chainId: CHAINID,
      /*
      forking: {
        url: TEST_URI[CHAINID],
        blockNumber: BLOCK_NUMBER[CHAINID],
        gasLimit: 8e6,
      },
      */
    },
    mainnet: {
      url: process.env.MAINNET_URI,
      accounts: {
        mnemonic: process.env.TEST_MNEMONIC,
      },
    },
    kovan: {
      url: process.env.KOVAN_URI,
      chainId: 42,
      accounts: {
        mnemonic: process.env.KOVAN_MNEMONIC,
      },
    },
    /*
    avax: {
      url: process.env.AVAX_URI,
      chainId: 43114,
      accounts: {
        mnemonic: process.env.AVAX_MNEMONIC,
      },
    },
    fuji: {
      url: process.env.FUJI_URI,
      chainId: 43113,
      accounts: {
        mnemonic: process.env.FUJI_MNEMONIC,
      },
    },
    */
  },
  mocha: {
    timeout: 500000,
  },
};
