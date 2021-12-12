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
// "0xB875937e75dB003F1E43d0733173E642A1f65d45","0xcbD2c857c1ab9C4A31Ed7bf05713625C8EF8ef04","0xB875937e75dB003F1E43d0733173E642A1f65d45","1638777600","55000000000000000000000",2,"0xB875937e75dB003F1E43d0733173E642A1f65d45",

  // The vault goes back into an Unlocked state once closePositions() is called. 
  // User can deposit 
  /*
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
  const receipt = await tx.wait(1);
  8am UTC - options expire 
  8-10am UTC - disputes window 
  10-11am UTC - instant withdrawal window - commit and close
  11am UTC - deposits deployed - rollToNext
  */
 // 1638856812
 // Commit then close den wait 1 hr to roll
 // Ask need wait how long den lock
 // console.log(await vault.connect(signer).nextOptionReadyAt());
 
  // This puts the vault into a Locked state, during which the vault will no longer accept direct withdraws or direct deposits.
  
  const tx = await vault.connect(signer).rollToNextOption({
    gasPrice,
    gasLimit: 700000,
  });
  
  console.log(tx.hash)
  
  process.exit(0);
  
}

deployOToken();
