const IvThetaVault = artifacts.require("IvThetaVault");
const AdminUpgradeabilityProxy = artifacts.require("AdminUpgradeabilityProxy");
const ProtocolAdapterLib = artifacts.require("ProtocolAdapter");
const Factory = artifacts.require("IvFactory");
const { encodeCall } = require("@openzeppelin/upgrades");
const { ethers, BigNumber } = require("ethers");
const { parseEther } = ethers.utils;

const {
  updateDeployedAddresses,
} = require("../scripts/helpers/updateDeployedAddresses");
const ACCOUNTS = require("../constants/accounts.json");
const DEPLOYMENTS = require("../constants/deployments.json");
const EXTERNAL_ADDRESSES = require("../constants/externalAddresses.json");

module.exports = async function (deployer, network) {
  const networkLookup = network.replace("-fork", "");
  const { admin, owner } = ACCOUNTS[networkLookup];

  await deployer.link(ProtocolAdapterLib, IvThetaVault);
  
  const factory = await Factory.at(DEPLOYMENTS[networkLookup].IvFactory);
  await factory.setAdapter("OPYN_GAMMA", DEPLOYMENTS[networkLookup].GammaAdapterLogic, { from: owner });
  
  // Deploying the logic contract
  const vault = await deployer.deploy(
    IvThetaVault,
    EXTERNAL_ADDRESSES[networkLookup].assets.weth,
    DEPLOYMENTS[networkLookup].IvFactory,
    DEPLOYMENTS[networkLookup].VaultRegistry,
    EXTERNAL_ADDRESSES[networkLookup].assets.weth,
    EXTERNAL_ADDRESSES[networkLookup].assets.usdc,
    EXTERNAL_ADDRESSES[networkLookup].airswapSwap,
    18,
    // WETH: 10**18, 10**10 0.0000001
    // WBTC: 0.000001
    BigNumber.from("10").pow(BigNumber.from("10")).toString(), // WBTC 10**3
    false,
    { from: admin }
  );
  
  await updateDeployedAddresses(
    network,
    "IvETHCoveredCallLogic",
    vault.address
  );

  // Deploying the proxy contract
  const initBytes = encodeCall(
    "initialize",
    ["address", "address", "uint256", "string", "string"],
    [
      owner,
      owner,
      parseEther("1000").toString(),
      "IV ETH Theta Vault",
      "iETH-THETA",
    ]
  );

  await deployer.deploy(
    AdminUpgradeabilityProxy,
    vault.address,
    admin,
    initBytes,
    {
      from: admin,
    }
  );

  await updateDeployedAddresses(
    network,
    "IvETHCoveredCall",
    AdminUpgradeabilityProxy.address
  );
};
