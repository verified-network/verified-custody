import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { configs } from '../contracts/CustodyContractServiceCreator';

function ParticipantConfirm2(props) {
    const [loading, setLoading] = useState(false);

  const confirmParticipant = async () => {
    setLoading(true);
    props.custodyContract.confirmParticipant().then(res => {
        console.log("App.js custodyContract.confirmParticipant", res);
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          props.setParticipant2Confirmed(true);
        }
      }).catch(error => {
        console.log("App.js custodyContract.confirmParticipant error", error);
      }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={confirmParticipant}>Confirm Participant 2 {loading ? <Spinner animation="border" size="sm" /> : null}</Button>
        {props.participant2Confirmed ? <span className='text-success'> Confirmed</span> : null}
      </div>
  );
}

export default ParticipantConfirm2;
