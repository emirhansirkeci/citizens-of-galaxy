const whitelistAdresses = require("./whitelistedAddresses");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

// === Whitelist Root Generate ===
const whitelistLeafNodes = whitelistAdresses.map((addr) => keccak256(addr));
const whitelistMerkleTree = new MerkleTree(whitelistLeafNodes, keccak256, {
  sortPairs: true,
});

const whitelistRoot = whitelistMerkleTree.getHexRoot();

export const currentRoots = () => {
  console.log({ whitelistRoot });
  return whitelistRoot;
};

export const proofGenerator = () => {
  const leaf = keccak256(window.ethereum.selectedAddress);
  const proof = whitelistMerkleTree.getHexProof(leaf);

  return { proof, leaf };
};

export const isWhitelisted = () => {
  const { proof, leaf } = proofGenerator();

  const isValid = whitelistMerkleTree.verify(proof, leaf, whitelistRoot);
  return isValid;
};
