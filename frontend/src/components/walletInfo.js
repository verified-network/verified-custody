import React from "react";
import { Spinner } from "react-bootstrap";
import { useAppData } from "../contexts/appData";

function WalletInfo(props) {
    const {walletBalances, walletAddresses, loadingBalances} = useAppData();

    console.log("walletBalances, walletAddresses", walletBalances, walletAddresses)

  return (
    <>
      <div className="px-4 py-2">
        <div style={{ flex: "1" }} className="d-flex align-items-center">
          <span>Balance: {loadingBalances ? <Spinner size="sm" animation="border" /> : <b>{walletBalances[props.index]} ETH</b>}</span>
        </div>
        <div style={{ flex: "1" }} className="d-flex align-items-center">
          Address: <span style={{fontSize: "10px"}}> {walletAddresses[props.index]}</span>
        </div>
      </div>
    </>
  );
}

export default WalletInfo;
