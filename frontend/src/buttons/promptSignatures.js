import React, { useEffect, useState } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function PromptSignatures(props) {
    const [loading, setLoading] = useState(false);
    const [loadingCreator, setLoadingCreator] = useState(false);
    const [loadingParticipant, setLoadingParticipant] = useState(false);
    const [showCreator, setShowCreator] = useState(false);
    const [showParticipant, setShowParticipant] = useState(false);
    const [creatorSigned, setCreatorSigned] = useState(false);
    const [participantSigned, setParticipantSigned] = useState(false);

    useEffect(() => {
      if (creatorSigned && participantSigned) {
        props.setaddSignTransactionListener(Math.random());
      }
    }, [creatorSigned, participantSigned])

  const promptSignatures = async () => {
    setLoading(true);
    props.promptSignatures();
    const vaultCreator = props.custodyContract.getVault();
    const vaultParticipant = props.custodyContractParticipant.getVault();
    // console.log("App.js promptSignatures", vault.notifyNewTransaction);
   
    props.custodyContract.promptSignatures().then(res => {
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          props.setPromptSignaturesDone(true);
      
          vaultCreator.notifyNewTransaction((res) => {
            const result = res.response.result;
            props.setTxid(result[2]);
            handleShowCreator();
            console.log("App.js notifyNewTransaction vaultCreator", res);
          })
      
          vaultParticipant.notifyNewTransaction((res) => {
            const result = res.response.result;
            props.setTxid(result[2]);
            handleShowParticipant(true);
            console.log("App.js notifyNewTransaction vaultParticipant", res);
          })
        }
      console.log("App.js custodyContract.promptSignatures", res);
    }).catch(error => {
      console.log("App.js custodyContract.promptSignatures error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  const signTransactionCreator = async () => {
    setLoadingCreator(true);
    props.custodyContract.signTransaction(props.txid).then(res => {
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          handleCloseCreator();
          setCreatorSigned(true);
          // props.setSignTransactionCreatorDone(true);
        }
      console.log("App.js custodyContract.signTransaction", res);
    }).catch(error => {
      console.log("App.js custodyContract.signTransaction error", error);
    }).finally(() => {
      setLoadingCreator(false);
    })
  }

  const signTransactionParticipant = async () => {
    setLoadingParticipant(true);
    props.custodyContract.signTransaction(props.txid).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        // props.setSignTransactionParticipantDone(true);
        handleCloseParticipant();
        setParticipantSigned(true);
      }
      console.log("App.js custodyContract.signTransaction", res);
    }).catch(error => {
      console.log("App.js custodyContract.signTransaction error", error);
    }).finally(() => {
      setLoadingParticipant(false);
    })
  }

  const handleCloseCreator = () => setShowCreator(false);
  const handleShowCreator = () => setShowCreator(true);

  const handleCloseParticipant = () => setShowParticipant(false);
  const handleShowParticipant = () => setShowParticipant(true);


  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button 
        disabled={loading || props.disabled} 
        onClick={promptSignatures}>Prompt Signatures {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.promptSignaturesDone ? <span className='text-success'> Done</span> : null}
        <Modal show={showCreator} onHide={() => {}}>
          <Modal.Header closeButton>
            <Modal.Title>Creator Transaction Sign</Modal.Title>
          </Modal.Header>
          <Modal.Body>Creator Transaction Sign</Modal.Body>
          <Modal.Footer>
            <Button disabled={loadingCreator} variant="primary" onClick={signTransactionCreator}>
              Sign Transaction Creator {loadingCreator ? <Spinner animation="border" size="sm" /> : null}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showParticipant} onHide={() => {}}>
          <Modal.Header closeButton>
            <Modal.Title>Participant Transaction Sign</Modal.Title>
          </Modal.Header>
          <Modal.Body>Participant Transaction Sign</Modal.Body>
          <Modal.Footer>
            <Button disabled={loadingParticipant} variant="primary" onClick={signTransactionParticipant}>
              Sign Transaction Participant {loadingParticipant ? <Spinner animation="border" size="sm" /> : null}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
}

export default PromptSignatures;
