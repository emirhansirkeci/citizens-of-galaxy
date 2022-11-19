import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { MaxSupply } from "../config";
import { getTotalSupply, getCost } from "../utils/contract";
import MintButton from "./MintButton";

export default function MintSection() {
  const [baseMintPrice, setBaseMintPrice] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);

  const [mintAmount, setMintAmount] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);

  const incrementHandler = (type) => {
    if (type == "increase") mintAmount < 10 && setMintAmount(mintAmount + 1);
    else if (type == "decrease")
      mintAmount > 1 && setMintAmount(mintAmount - 1);
  };

  const config = async () => {
    setTotalSupply(await getTotalSupply());

    getCost().then((result) => {
      setMintPrice(result);
      setBaseMintPrice(result);
    });
  };

  useEffect(() => {
    config();
  }, []);

  useEffect(() => {
    setMintPrice((mintAmount * baseMintPrice).toFixed(3));
  }, [mintAmount]);

  return (
    <div className="mint-section">
      <div className="max">
        <div>Max Supply</div>
        <div>{MaxSupply}</div>
      </div>
      <div className="total">
        <div>Total Supply</div>
        <div>{totalSupply}</div>
      </div>

      <div className="increment-section">
        <div className="decrease" onClick={() => incrementHandler("decrease")}>
          <Icon width={"22px"} icon="akar-icons:minus" />
        </div>
        <div className="mintAmount">{mintAmount}</div>
        <div className="increase" onClick={() => incrementHandler("increase")}>
          <Icon width={"22px"} icon="akar-icons:plus" />
        </div>
      </div>

      <div>Price: {mintPrice > 0 ? mintPrice : "Free"} + Gas Fee</div>

      <MintButton mintAmount={mintAmount} />
    </div>
  );
}
