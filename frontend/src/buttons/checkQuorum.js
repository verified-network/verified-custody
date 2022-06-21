import React, { useEffect, useState } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function CheckQuorum(props) {
    const [loading, setLoading] = useState(false);
    const [loadingCheckQuorum, setLoadingCheckQuorum] = useState(false);
    const [loadingGetShards, setLoadingGetShards] = useState(false);
    const [show, setShow] = useState(false);
    const [shards, setShares] = useState(false);

    useEffect(() => {
      if(props.addSignTransactionListener) {
        console.log("App.js notifySignTransaction CheckQuorum");

    const vaultCreator = props.custodyContract.getVault();

        vaultCreator.notifySignTransaction((res) => {
          handleShow();
          checkQuorum();
          console.log("App.js notifySignTransaction vaultCreator", res);
        })
      }
    }, [props.addSignTransactionListener])

  const checkQuorum = async () => {
    setLoadingCheckQuorum(true);
    props.custodyContract.checkQuorum(props.txid).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        const result = res.response.result;
        props.setCheckQuorumDone(result[0]);
        getShards();
      }
      console.log("App.js custodyContract.checkQuorum", res);
    }).catch(error => {
      console.log("App.js custodyContract.checkQuorum error", error);
    }).finally(() => {
      setLoadingCheckQuorum(false);
    })
  }

  const getShards = async () => {
    setLoadingGetShards(true);
    props.custodyContract.getShards(props.txid).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        const result = res.response.result;
        const shards = result.filter(item => item !== '')
        var comb = window.secrets.combine(shards);
        setShares(comb);
      }
      console.log("App.js custodyContract.getShards", {res, comb});
    }).catch(error => {
      console.log("App.js custodyContract.getShards error", error);
    }).finally(() => {
      setLoadingGetShards(false);
    })
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        {/* <Button disabled={loading || props.disabled} onClick={checkQuorum}>Check Quorum {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.checkQuorumDone ? <span className='text-success'> {props.checkQuorumDone ? "True" : "False"} </span> : null} */}

        <Modal show={show} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Participant Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Original Private Key: {props.privateKey}
        <br/> */}
          Check Quorum: {loadingCheckQuorum ? <Spinner animation="border" size="sm" /> : props.checkQuorumDone ? "True" : "False"}
          <br/>
          Private Key by Shards: {loadingGetShards ? <Spinner animation="border" size="sm" /> : shards}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button disabled={confirmLoading} variant="primary" onClick={confirmParticipant}>
            Confirm {confirmLoading ? <Spinner animation="border" size="sm" /> : null}
          </Button> */}
        </Modal.Footer>
      </Modal>
      </div>
  );
}

export default CheckQuorum;
