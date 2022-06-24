import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function InsufficientFundModal(props) {
  const handleClose = () => props.setShow(false);

  console.log("InsufficientFundModal Render", props)

  return (
    <>
      <Modal centered show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insufficient Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This signer wallet has zero balance, Please send some ETH to this account.
            <br/>
            <span>Address: <b>{props.address}</b></span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InsufficientFundModal;