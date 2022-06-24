import React, { useEffect, useState } from "react";
import { Button, Spinner, Modal, Form } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { useAppData } from "../contexts/appData";
import { isBalanceLow } from "../utils";

function NewTransactionListeners(props) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [pin, setPin] = useState(props.pin);
  const [error, setError] = useState("");

  const {walletBalances, showInsufficientFundModal} = useAppData();

  const balance = walletBalances[props.index];

  useEffect(() => {
    const vault = props.custodyContract.getVault();

    vault.notifyNewTransaction((res) => {
      const result = res.response.result;
      console.log(`App.js notifyNewTransaction ${props.email}`, res);
      props.setTxid(result[2]);
      handleShow();
    });
  }, []);

  useEffect(() => {
    setError("");
  }, [pin]);

  const signTransaction = async (e) => {
    e.preventDefault();
    if (!pin) {
      setError("Please enter pin");
      return;
    }
    if(isBalanceLow(balance)) {
      showInsufficientFundModal(props.index)
      return;
    }
    setLoading(true);
    props.custodyContract
      .signTransaction(props.creator.email, props.email, props.txid, pin)
      .then((res) => {
        if (res.status) {
          NotificationManager.error(res.message);
        } else {
          props.onTransactionSigned(props.email);
          handleClose();
        }
        console.log(
          `App.js custodyContract.signTransaction ${props.email}`,
          res
        );
      })
      .catch((error) => {
        console.log(
          `App.js custodyContract.signTransaction error ${props.email}`,
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal size="lg" show={show} onHide={() => {}}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.isCreator ? "Signer" : "Co-Signer"} Transaction Sign (
          {props.email})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.isCreator ? "Signer" : `Co-Signer ${props.index}`} Transaction Sign
        <Form onSubmit={signTransaction}>
          <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
            <Form.Label htmlFor="disabledTextInput">Enter PIN</Form.Label>
            <Form.Control
              onChange={(e) => setPin(e.target.value)}
              value={pin}
              type="number"
              placeholder="Enter PIN"
              autoFocus
            />
          </Form.Group>
          <span className="text-danger">{error}</span>
          <div className="d-flex justify-content-end">
            <Button
              disabled={loading || !pin}
              variant="primary"
              onClick={signTransaction}
            >
              Sign Transaction {" "}
              {loading ? <Spinner animation="border" size="sm" /> : null}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewTransactionListeners;
