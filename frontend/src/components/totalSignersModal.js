import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { isDev } from "../App";

function TotalSignersModal(props) {
    const [value, setValue] = useState("3");
    const [minimumSigners, setMinimumSigners] = useState("3");
    const [error, setError] = useState('');
    const [errorMinimum, setErrorMinimum] = useState('');

    useEffect(() => {
        setError("");
        setErrorMinimum("");
    }, [value, minimumSigners])

    useEffect(() => {
      if(isDev) {
        save();
      }
    }, [])

    const save = () => {
        if(!value) {
            setError("Please enter signers");
            return;
        } else if(!minimumSigners) {
            setErrorMinimum("Please enter minimum signers");
            return;
        } else if(Number(value) < 2) {
            setError("Minimum signer should be 2");
            return;
        } else if(Number(value) > 5) {
            setError("Max signer should be 5");
            return;
        } else if(Number(minimumSigners) < 2) {
            setErrorMinimum("Minimum signer should be 2");
            return;
        } else if(Number(minimumSigners) > Number(value)) {
            setErrorMinimum(`Max signer should not more than ${value}`);
            return;
        }
        props.setTotalSigners(Number(value), Number(minimumSigners));
    }

  return (
    <div className="mb-2 mt-3 flex align-items-center">
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!props.totalSigners}
      >
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>How many signers do you want to create ?</Form.Label>
              <Form.Control
                onChange={e => setValue(e.target.value)}
                value={value}
                type="number"
                placeholder="Total signers"
                autoFocus
              />
              <span className="text-danger">{error}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>What is the minimum number of signatures required to sign a transaction ?</Form.Label>
              <Form.Control
                onChange={e => setMinimumSigners(e.target.value)}
                value={minimumSigners}
                type="number"
                placeholder="Minimum signers"
                autoFocus
              />
              <span className="text-danger">{errorMinimum}</span>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={save}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TotalSignersModal;
