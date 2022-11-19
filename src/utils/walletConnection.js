import { toast } from "react-toastify";
import ChangeNetwork from "../Components/ChangeNetwork";

// Specify the contract's deployed chain id
import { DeployedChainId } from "../config";
//

// Check the network to prevent possibly issues
const isWrongNetwork = () => {
  if (window.ethereum.chainId != DeployedChainId) {
    toast.dismiss();
    toast.error(<ChangeNetwork />);
  }
};
//

export async function connectWallet(setWalletAddress) {
  if (!window.ethereum) {
    toast.dismiss();
    return toast.error(
      "There is no Metamask Wallet App or Extension found on your device please try to connect again after install it."
    );
  }

  window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then((acc) => {
      setWalletAddress(acc[0]);
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function currentWallet(setWalletAddress) {
  if (!window.ethereum) return;

  window.ethereum
    .request({ method: "eth_accounts" })
    .then((acc) => {
      setWalletAddress(acc[0]);

      // Show error message if user is using the wrong network
      isWrongNetwork();
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function walletListener(setWalletAddress) {
  if (!window.ethereum) return;

  window.ethereum.on("accountsChanged", async (acc) => {
    if (acc.length > 0) {
      setWalletAddress(acc[0]);

      // Show error message if user is using the wrong network
      isWrongNetwork();
    } else {
      setWalletAddress("");
    }
  });

  window.ethereum.on("chainChanged", (chainId) => {
    // Show error message if user is using the wrong network
    if (chainId != DeployedChainId) {
      toast.dismiss();
      toast.error(<ChangeNetwork />);
    }
  });
}
