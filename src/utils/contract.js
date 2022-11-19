import { toast } from "react-toastify";
import Web3 from "web3";
import ChangeNetwork from "../Components/ChangeNetwork";
import { isWhitelisted, proofGenerator } from "./checkAllowness";

// Specify the contract's deployed chain id
import { DeployedChainId, Provider, ContractAddress } from "../config";
//

const web3 = new Web3(Provider);

const contractABI = require("../contract/citizensofgalaxy.json");

const nftContract = new web3.eth.Contract(contractABI, ContractAddress);

// Get Total Supply of Project
export const getTotalSupply = async () => {
  const result = await nftContract.methods.totalSupply().call();
  return result;
};
//

// Get NFT Cost
export const getCost = async () => {
  const result = await nftContract.methods.cost().call();
  const resultEther = web3.utils.fromWei(result, "ether");

  return resultEther;
};
//

// Get Sale Status
export const getPresaleStatus = async () => {
  const result = await nftContract.methods.presale().call();
  return result;
};

export const getPublicSaleStatus = async () => {
  const result = await nftContract.methods.publicsale().call();
  return result;
};
//

// User's balance controls
const mintAmountController = (mintAmount, maxMint, mintedBalance) => {
  if (mintAmount > maxMint) {
    toast.dismiss();
    toast.error("You can mint maximum " + maxMint + " NFT(s).");
    return false;
  } else if (maxMint - mintedBalance <= 0) {
    toast.dismiss();
    toast.error("You already claimed all of your NFT(s).");
    return false;
  } else if (maxMint - mintedBalance < mintAmount) {
    toast.dismiss();
    toast.error(
      "You have " + (maxMint - mintedBalance) + " NFT(s) left to mint."
    );
    return false;
  }

  return true;
};

export const getPublicMintedBalance = async (mintAmount) => {
  if (!window.ethereum || !window.ethereum.selectedAddress) return;

  const maxMint = await nftContract.methods.maxPublicMint().call();
  const mintedBalance = await nftContract.methods
    .publicMintedBalance(window.ethereum.selectedAddress)
    .call();

  const result = mintAmountController(mintAmount, maxMint, mintedBalance);
  return result;
};

export const getPresaleMintedBalance = async (mintAmount) => {
  if (!window.ethereum || !window.ethereum.selectedAddress) return;

  const maxMint = await nftContract.methods.maxPresaleMint().call();
  const mintedBalance = await nftContract.methods
    .presaleMintedBalance(window.ethereum.selectedAddress)
    .call();

  const result = mintAmountController(mintAmount, maxMint, mintedBalance);
  return result;
};
//

// Check Errors Before Mint To Prevent Issues
const checkErrors = () => {
  if (!window.ethereum) {
    toast.dismiss();
    toast.error("Please download Metamask wallet first.");
    return false;
  }

  if (!window.ethereum.selectedAddress) {
    toast.dismiss();
    toast.error("Please connect your wallet first.");
    return false;
  }

  if (window.ethereum.chainId != DeployedChainId) {
    toast.dismiss();
    toast.error(<ChangeNetwork />);
    return false;
  }

  return true;
};
//

// Send Transaction To User Via Metamask
const sendTx = async (data, mintAmount) => {
  const cost = await getCost();

  const transactionParameters = {
    to: ContractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // Must match user's active address.
    value: parseInt(web3.utils.toWei(cost, "ether") * mintAmount).toString(16), // hex
    gasLimit: "0",
    data: data, // Make call to NFT smart contract
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log({ txHash });
    return toast.success(
      "Transaction successfully sent! Please do not rush to start a new transaction before your transaction is approved."
    );
  } catch (error) {
    console.log(error);

    return;
  }
};
//

// Public Mint
export const mint = async (mintAmount) => {
  // Metamask and Chain Id Controls
  const isReadyToMint = checkErrors();
  if (!isReadyToMint) return;
  //

  // Check user's minted balance to prevent over-minting
  const publicMintedBalance = await getPublicMintedBalance(mintAmount);
  if (!publicMintedBalance) return;
  //

  const data = nftContract.methods.mint(mintAmount).encodeABI();

  sendTx(data, mintAmount);
};

// Whitelist (Presale) Mint
export const whitelistMint = async (mintAmount) => {
  // Metamask and Chain Id Controls
  const isReadyToMint = checkErrors();
  if (!isReadyToMint) return;
  //

  // Check user's minted balance to prevent over-minting
  const presaleMintedBalance = await getPresaleMintedBalance(mintAmount);
  if (!presaleMintedBalance) return;
  //

  // Check if user is whitelisted or not
  const _isWhitelisted = isWhitelisted();
  if (!_isWhitelisted) return toast.error("You're not whitelisted");
  //

  const { proof } = proofGenerator();
  const data = nftContract.methods.whitelistMint(mintAmount, proof).encodeABI();

  sendTx(data, mintAmount);
};
