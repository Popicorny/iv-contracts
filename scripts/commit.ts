import { BigNumber, ethers } from "ethers";
import {
  getDefaultProvider,
  getDefaultSigner,
} from "./helpers/getDefaultEthersProvider";
import { Command } from "commander";
import { encodeCommitAndClose } from "./helpers/encodeCommitAndClose";
import { getGasPrice } from "./helpers/getGasPrice";
import hre from "hardhat";
import externalAddresses from "../constants/externalAddresses.json";
import oTokenFactoryABI from "../constants/abis/OtokenFactory.json";
import ribbonThetaVaultABI from "../constants/abis/RibbonThetaVault.json";

const { parseUnits } = ethers.utils;

require("dotenv").config();

const program = new Command();

program.version("0.0.1");

program.requiredOption("-n, --network <network>", "Network", "mainnet");

program
  .requiredOption("-a, --address <address>", "Address")
  .requiredOption("-d, --data <data>", "Data")

program.parse(process.argv);

async function deployOToken() {

  const network = program.network === "mainnet" ? "mainnet" : "kovan";

  const provider = getDefaultProvider(program.network);
  const signer = getDefaultSigner("m/44'/60'/0'/0/2", network).connect(
    provider
  );

  const vault = new ethers.Contract(
    program.address,
    ribbonThetaVaultABI,
    provider
  );

  let gasPrice;
  if (network === "mainnet") {
    gasPrice = (await getGasPrice()).add(parseUnits("20", "gwei"));
  } else {
    gasPrice = parseUnits("20", "gwei");
  }

  console.log(`Gas price: ${gasPrice.toString()}`);

  var params = program.data.split("\"").join("").split(",");
  // The vault goes back into an Unlocked state once closePositions() is called. 
  // User can deposit 
  const tx = await vault
    .connect(signer)
    .commitAndClose(
      params,
      {
        gasPrice,
        gasLimit: 700000,
      }
    );
  // Expiry must be more than current time + 1 hr
  console.log("Txhash: " + tx.hash);
  process.exit(0);
  
}

deployOToken();
