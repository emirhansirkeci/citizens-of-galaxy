import { useEffect, useState } from "react";
import {
  getPresaleStatus,
  getPublicSaleStatus,
  whitelistMint,
  mint,
} from "../utils/contract";

export default function MintButton({ mintAmount }) {
  const [presaleStatus, setPresaleStatus] = useState();
  const [publicSaleStatus, setPublicSaleStatus] = useState();

  const config = async () => {
    setPresaleStatus(await getPresaleStatus());
    setPublicSaleStatus(await getPublicSaleStatus());
  };

  useEffect(() => {
    config();
  }, []);

  if (publicSaleStatus) {
    return (
      <button onClick={() => mint(mintAmount)} className="mint-btn">
        Public Mint
      </button>
    );
  } else if (presaleStatus) {
    return (
      <button onClick={() => whitelistMint(mintAmount)} className="mint-btn">
        Presale Mint
      </button>
    );
  } else {
    return <button className="mint-btn">MINT SOON</button>;
  }
}
