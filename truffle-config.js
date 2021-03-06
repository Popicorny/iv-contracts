require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          process.env.KOVAN_MNEMONIC,
          process.env.INFURA_KOVAN_URI
        ),
      network_id: 42,
      gas: 5500000,
      networkCheckTimeout: 20000,
      confirmations: 1,
      timeoutBlocks: 20000,
      skipDryRun: true,
    },
    /*
    "mainnet-sim": {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      skipDryRun: true,
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          "http://127.0.0.1:8545",
          0,
          10,
          "m/44'/60'/0'/0/"
        ),
      gas: 5500000,
      gasPrice: 85000000000,
      networkCheckTimeout: 20000,
      confirmations: 0,
      timeoutBlocks: 20000,
    },
    */
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.KOVAN_MNEMONIC,
          process.env.MAINNET_URI
        ),
      network_id: 1,
      gasPrice: 101000000000,
      networkCheckTimeout: 20000,
      confirmations: 1,
      timeoutBlocks: 20000,
      skipDryRun: true,
    },
  },

  api_keys: {
    etherscan: "ENT2EY4U26UMK69U4IQ27IY6CKNY5WUETZ",
  },

  plugins: ["truffle-contract-size", "truffle-plugin-verify"],

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.7.2",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
