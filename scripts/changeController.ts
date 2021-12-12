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
import ribbonFactoryABI from "../constants/abis/RibbonFactory.json";

const { parseUnits } = ethers.utils;

require("dotenv").config();

const program = new Command();

program.version("0.0.1");

program.requiredOption("-n, --network <network>", "Network", "mainnet");

program.parse(process.argv);

async function deployOToken() {

  const network = program.network === "mainnet" ? "mainnet" : "kovan";

  const provider = getDefaultProvider(program.network);
  const signer = getDefaultSigner("m/44'/60'/0'/0/0", network).connect(
    provider
  );

  const adapter = new ethers.Contract(
    '0x46B359109857B1820C119091345600094B9B5079',
    ribbonFactoryABI,
    provider
  );

  let gasPrice;
  if (network === "mainnet") {
    gasPrice = (await getGasPrice()).add(parseUnits("20", "gwei"));
  } else {
    gasPrice = parseUnits("20", "gwei");
  }

  console.log(`Gas price: ${gasPrice.toString()}`);
  
  // setAdapter(string memory protocolName, address adapter)
  // This puts the vault into a Locked state, during which the vault will no longer accept direct withdraws or direct deposits.
  await adapter.connect(signer).setAdapter('OPYN_GAMMA', '0x638Fb6320Da91Abd87D8B3145008a2a80d7E9793', {
    gasPrice,
    gasLimit: 700000,
  });
  
  process.exit(0);
  
}

deployOToken();
