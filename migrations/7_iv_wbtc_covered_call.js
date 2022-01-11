const IvThetaVault = artifacts.require("IvThetaVault");
const AdminUpgradeabilityProxy = artifacts.require("AdminUpgradeabilityProxy");
const ProtocolAdapterLib = artifacts.require("ProtocolAdapter");
const { encodeCall } = require("@openzeppelin/upgrades");
const { ethers } = require("ethers");

const {
  updateDeployedAddresses,
} = require("../scripts/helpers/updateDeployedAddresses");
const ACCOUNTS = require("../constants/accounts.json");
const DEPLOYMENTS = require("../constants/deployments.json");
const EXTERNAL_ADDRESSES = require("../constants/externalAddresses.json");

module.exports = async function (deployer, network) {
  const networkLookup = network.replace("-fork", "");
  const { admin, owner } = ACCOUNTS[networkLookup];

  // await ProtocolAdapterLib.deployed();

  await deployer.link(ProtocolAdapterLib, IvThetaVault);

  // // Deploying the logic contract
  await deployer.deploy(
    IvThetaVault,
    EXTERNAL_ADDRESSES[networkLookup].assets.wbtc,
    DEPLOYMENTS[networkLookup].IvFactory,
    DEPLOYMENTS[networkLookup].VaultRegistry,
    EXTERNAL_ADDRESSES[networkLookup].assets.weth,
    EXTERNAL_ADDRESSES[networkLookup].assets.usdc,
    EXTERNAL_ADDRESSES[networkLookup].airswapSwap,
    8,
    ethers.BigNumber.from("10").pow("3").toString(),
    false,
    { from: admin }
  );
  await updateDeployedAddresses(
    network,
    "IvWBTCCoveredCallLogic",
    IvThetaVault.address
  );

  // Deploying the proxy contract
  const initBytes = encodeCall(
    "initialize",
    ["address", "address", "uint256", "string", "string"],
    [
      owner,
      owner,
      ethers.BigNumber.from("10").pow("11").toString(), // 1000 (3 leading zeros) + 8 leading zeros
      "IV BTC Theta Vault",
      "iBTC-THETA",
    ]
  );

  await deployer.deploy(
    AdminUpgradeabilityProxy,
    IvThetaVault.address,
    admin,
    initBytes,
    {
      from: admin,
    }
  );

  await updateDeployedAddresses(
    network,
    "IvWBTCCoveredCall",
    AdminUpgradeabilityProxy.address
  );
};
