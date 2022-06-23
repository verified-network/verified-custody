import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import CustodyContractServiceCreator from "../contracts/CustodyContractServiceCreator";
import NewTransactionListeners from "./newTransactionListeners";
import SignTransactionListener from "./signTransactionListener";

function PromptSignatures(props) {
  const [loading, setLoading] = useState(false);
  const [addNewTransactionListeners, setAddNewTransactionListeners] =
    useState(false);
  const [addSignTransactionListener, setAddSignTransactionListener] =
    useState(false);
  const [promptSignaturesDone, setPromptSignaturesDone] = useState(false);
  const [signedCount, setSignedCount] = useState(0);
  const [transactionSigned, setTransactionSigned] = useState(false);
  const [txid, setTxid] = useState("");

  useEffect(() => {
    console.log("PromptSignatures useEffect", {minimumSigners: props.minimumSigners, signedCount})
    if (signedCount >= props.minimumSigners) {
      setAddSignTransactionListener(true);
    }
  }, [signedCount]);

  useEffect(() => {
    console.log("PromptSignatures transactionSigned", {transactionSigned})

    if (transactionSigned) {
      setSignedCount(signedCount + 1);
    }
  }, [transactionSigned]);

  const promptSignatures = async () => {
    setLoading(true);
    const custodyContract = new CustodyContractServiceCreator(props.mnemonic);

    custodyContract
      .promptSignatures(props.email)
      .then((res) => {
        if (res.status) {
          NotificationManager.error(res.message);
        } else {
          setPromptSignaturesDone(true);
          setAddNewTransactionListeners(true);
        }
        console.log("App.js custodyContract.promptSignatures", res);
      })
      .catch((error) => {
        console.log("App.js custodyContract.promptSignatures error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onTransactionSigned = (from) => {
    console.log("PromptSignatures onTransactionSigned", {from})

    setTransactionSigned(Math.random());
  }

  return (
    <div className="mb-2 mt-3 flex align-items-center">
      <Button disabled={loading || props.disabled} onClick={promptSignatures}>
        Sign transaction{" "}
        {loading ? <Spinner animation="border" size="sm" /> : null}
      </Button>
      {promptSignaturesDone ? (
        <>
          <span className="text-success"> Requested, </span>
          <span className="text-success">Signed By {signedCount} (<b>Required: {props.minimumSigners}</b> )</span>
        </>
      ) : null}

      {addNewTransactionListeners
        ? props.signersArray.map((item, index) => {
            const isCreator = !index;
            const creator = props.signersArray[0];
            const custodyContract = new CustodyContractServiceCreator(
              item.mnemonic
            );

            return (
              <NewTransactionListeners
                custodyContract={custodyContract}
                txid={txid}
                setTxid={setTxid}
                isCreator={isCreator}
                onTransactionSigned={onTransactionSigned}
                index={index}
                creator={creator}
                {...item}
              />
            );
          })
        : null}
      {addSignTransactionListener ? <SignTransactionListener {...props} signedCount={signedCount} txid={txid}/> : null}
    </div>
  );
}

export default PromptSignatures;
