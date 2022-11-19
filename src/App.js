import MintSection from "./Components/MintSection";
import WalletSection from "./Components/WalletSection";

import logo from "./images/logo.gif";

import { useState, useEffect } from "react";
import { currentWallet, walletListener } from "./utils/walletConnection";
import { currentRoots } from "./utils/checkAllowness";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProjectName } from "./config";

function App() {
  const [walletAddress, setWalletAddress] = useState();

  const config = async () => {
    await currentWallet(setWalletAddress);
    await walletListener(setWalletAddress);
  };

  useEffect(() => {
    currentRoots();
    config();
  }, []);

  return (
    <div className="App">
      <div className="introduce-section">
        <img src={logo} />
        <div>
          <h3>{ProjectName}</h3>
        </div>
      </div>

      <div className="main-section">
        <WalletSection
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
        />
        <MintSection />
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}

export default App;
