import { DeployedChainId, DeployedChainName } from "../config";

const changeNetworkHandler = async () => {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: DeployedChainId }], // chainId must be in hexadecimal numbers
  });
};

export default function ChangeNetwork() {
  return (
    <span onClick={() => changeNetworkHandler()}>
      <label>
        You must be use {DeployedChainName} to mint. <b>CLICK HERE</b> to use
        the right network.
      </label>
    </span>
  );
}
