// Main Network
const publicProvider =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const alchemyProvider = "";

const chainId = "0x1";
const chainName = "Ethereum Main Network";
const contractAddress = "0x7b38a671c7a9e534acc04ef91f5ab32d7968dcf8";
//

// Test Network { GOERLI }

const publicTestProvider = "";
const alchemyTestProvider = "";

const testChainId = "";
const testChainName = "";
const testContractAddress = "";

// ===========================

const MODE = "PROD";

export const ProjectName = "Citizens of Galaxy";
export const MaxSupply = 1818;

export const ContractABI = require("./contract/citizensofgalaxy.json");

export const DeployedChainId = MODE == "PROD" ? chainId : testChainId;
export const DeployedChainName = MODE == "PROD" ? chainName : testChainName;

export const ContractAddress =
  MODE == "PROD" ? contractAddress : testContractAddress;
export const Provider = MODE == "PROD" ? publicProvider : publicTestProvider;

// ===========================
