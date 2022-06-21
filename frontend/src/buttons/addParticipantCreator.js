import React, { useState } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { configs } from '../contracts/CustodyContractServiceCreator';


function AddParticipantCreator(props) {
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [show, setShow] = useState(false);

  const addParticipant = async () => {
    setLoading(true);
    props.custodyContract.addParticipant(configs.creatorEmail, props.shares[0]).then(res => {
      console.log("App.js custodyContract.addParticipant", res);
      props.setParticipantAdded(true);
      const vault = props.custodyContract.getVault();

      vault.notifyNewParticipant((res) => {
        const result = res.response.result;
        console.log("App.js notifyNewParticipant custodyContract", res);
        handleShow();
      })
    }).catch(error => {
      console.log("App.js custodyContract.addParticipant error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  const confirmParticipant = async () => {
    setConfirmLoading(true);
    props.custodyContract.confirmParticipant().then(res => {
        console.log("App.js custodyContract.confirmParticipant", res);
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          handleClose();
          props.setParticipant1Confirmed(true);
        }
      }).catch(error => {
        console.log("App.js custodyContract.confirmParticipant error", error);
      }).finally(() => {
        setConfirmLoading(false);
    })
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={addParticipant}>Add Participant 1 {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.participantAdded ? <span className='text-success'> Participant Added</span> : null}
        <Modal show={show} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Creator Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm participant 1</Modal.Body>
        <Modal.Footer>
          <Button disabled={confirmLoading} variant="primary" onClick={confirmParticipant}>
            Confirm {confirmLoading ? <Spinner animation="border" size="sm" /> : null}
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
}

export default AddParticipantCreator;
