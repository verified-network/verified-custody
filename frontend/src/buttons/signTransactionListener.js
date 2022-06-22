import React, { useEffect, useState } from "react";
import { Spinner, Modal } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

function SignTransactionListener(props) {
  const [loadingCheckQuorum, setLoadingCheckQuorum] = useState(false);
  const [loadingGetShards, setLoadingGetShards] = useState(false);
  const [show, setShow] = useState(false);
  const [shards, setShares] = useState(false);
  const [checkQuorumDone, setCheckQuorumDone] = useState(false);

  useEffect(() => {
    console.log("App.js notifySignTransaction CheckQuorum");

    const vaultCreator = props.custodyContract.getVault();

    vaultCreator.notifySignTransaction((res) => {
      checkQuorum();
      console.log("App.js notifySignTransaction vaultCreator", res);
    });
  }, [props.signedCount]);

  const checkQuorum = async () => {
    setLoadingCheckQuorum(true);
    props.custodyContract
      .checkQuorum(props.txid)
      .then((res) => {
        if (res.status) {
          // NotificationManager.error(res.message);
          console.log("checkQuorum", res.message);
        } else {
          const result = res.response.result;
          setCheckQuorumDone(result[0]);
          handleShow();
          getShards();
        }
        console.log("App.js custodyContract.checkQuorum", res);
      })
      .catch((error) => {
        console.log("App.js custodyContract.checkQuorum error", error);
      })
      .finally(() => {
        setLoadingCheckQuorum(false);
      });
  };

  const getShards = async () => {
    setLoadingGetShards(true);
    props.custodyContract
      .getShards(props.txid)
      .then((res) => {
        if (res.status) {
          NotificationManager.error(res.message);
        } else {
          const result = res.response.result;
          const shards = result.filter((item) => item !== "");
          var comb = window.secrets.combine(shards);
          setShares(comb);
        }
        console.log("App.js custodyContract.getShards", { res, comb });
      })
      .catch((error) => {
        console.log("App.js custodyContract.getShards error", error);
      })
      .finally(() => {
        setLoadingGetShards(false);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="mb-2 mt-3 flex align-items-center">
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Get Shards</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Original Private Key:</b> {props.privateKey}
        <br/>
          <b>Check Quorum:</b>{" "}
          {loadingCheckQuorum ? (
            <Spinner animation="border" size="sm" />
          ) : checkQuorumDone ? (
            "True"
          ) : (
            "False"
          )}
          <br />
          <b>Private Key by Shards:</b>{" "}
          {loadingGetShards ? <Spinner animation="border" size="sm" /> : shards}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SignTransactionListener;
