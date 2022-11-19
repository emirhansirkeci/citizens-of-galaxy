import metamask from "../images/metamask.svg";
import { connectWallet } from "../utils/walletConnection";

export default function WalletSection({ walletAddress, setWalletAddress }) {
  return (
    <div>
      {walletAddress ? (
        <div className="wallet-section">
          <div className="wallet-text">
            {walletAddress.substring(0, 4) +
              "..." +
              walletAddress.substring(walletAddress.length - 4)}
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            connectWallet(setWalletAddress);
          }}
          className="wallet-section"
        >
          <img src={metamask} />
          <div className="wallet-text">Connect Metamask</div>
        </div>
      )}
    </div>
  );
}
