import React, { useEffect, useState } from "react";
import { Button, Spinner, Modal, Form } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { useAppData } from "../contexts/appData";
import CustodyContractService from "../contracts/CustodyContractService";
import { isBalanceLow } from "../utils";

function AddParticipant(props) {
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [participantAdded, setParticipantAdded] = useState(false);
  const [pin, setPin] = useState(props.participant.pin);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const {walletBalances, showInsufficientFundModal} = useAppData();

  const balance = walletBalances[props.mainIndex];

  const addParticipant = async () => {
    if(isBalanceLow(balance)) {
      showInsufficientFundModal(props.mainIndex)
      return;
    }
    setLoading(true);
    
    const custodyContract = new CustodyContractService(props.creator.mnemonic);

    custodyContract
      .addParticipant(props.creator.email, props.participant.email, props.share)
      .then((res) => {
        console.log("App.js custodyContract.addParticipant", res);

        if (res.status) {
          setLoading(false);
          NotificationManager.error(res.message);
        } else {
          setParticipantAdded(true);
          const vault = custodyContract.getVault();

          vault.notifyNewParticipant((res) => {
            console.log(
              `App.js notifyNewParticipant custodyContract ${props.participant.email}`,
              res
            );
            setLoading(false);
            handleShow();
          });
        }
      })
      .catch((error) => {
        console.log(
          `App.js custodyContract.addParticipant error ${props.participant.email}`,
          error
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    setError("");
  }, [pin]);

  const confirmParticipant = async (e) => {
    e.preventDefault();
    if(isBalanceLow(balance)) {
      showInsufficientFundModal(props.mainIndex)
      return;
    }
    if (!pin) {
      setError("Please enter pin");
      return;
    }
    setConfirmLoading(true);
    const custodyContractParticipant = new CustodyContractService(props.participant.mnemonic);

    custodyContractParticipant
      .confirmParticipant(props.creator.email, props.participant.email, pin)
      .then((res) => {
        console.log(
          `App.js custodyContractParticipant.confirmParticipant ${props.participant.email}`,
          res
        );
        if (res.status) {
          NotificationManager.error(res.message);
        } else {
          props.onParticipantAdded();
          setConfirmed(true);
          handleClose();
        }
      })
      .catch((error) => {
        console.log(
          `App.js custodyContract.confirmParticipant error ${props.participant.email}`,
          error
        );
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="mb-2 mt-3 flex align-items-center">
      <Button disabled={loading || participantAdded} onClick={addParticipant}>
        Add {props.isCreator ? "Signer" : `Co-Signer ${props.index}`}{" "}
        {loading ? <Spinner animation="border" size="sm" /> : null}
      </Button>
      {participantAdded ? (
        <>
          <span className="text-success"> Added, </span>
          {!confirmed ? <span className="text-danger"> Not Confirmed</span> : <span className="text-success"> Confirmed</span>}
        </>
      ) : null}
      <Modal size="lg" show={show} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>
            Participant Confirmation ({props.participant.email})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm {props.isCreator ? "Signer" : `Co-Signer ${props.index}`}
          <Form onSubmit={confirmParticipant}>
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
                disabled={confirmLoading || !pin}
                variant="primary"
                onClick={confirmParticipant}
              >
                Confirm{" "}
                {confirmLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : null}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddParticipant;
