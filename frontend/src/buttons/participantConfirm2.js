import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { participantEmail, participantId, participantPin } from '../App';

function ParticipantConfirm2(props) {
    const [loading, setLoading] = useState(false);

  const confirmParticipant = async () => {
    setLoading(true);
    props.custodyContract.confirmParticipant(participantEmail, participantId, props.shares[1], participantPin).then(res => {
        console.log("App.js custodyContract.confirmParticipant", res);
        props.setParticipant2Confirmed(true);
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
