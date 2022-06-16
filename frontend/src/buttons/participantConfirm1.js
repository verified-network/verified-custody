import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

function ParticipantConfirm1(props) {
    const [loading, setLoading] = useState(false);

  const confirmParticipant = async () => {
    setLoading(true);
    props.custodyContract.confirmParticipant('', '', props.shares[0], '').then(res => {
        console.log("App.js custodyContract.confirmParticipant", res);
        props.setParticipant1Confirmed(true);
      }).catch(error => {
        console.log("App.js custodyContract.confirmParticipant error", error);
      }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={confirmParticipant}>Confirm Participant 1 {loading ? <Spinner animation="border" size="sm" /> : null}</Button>
        {props.participant1Confirmed ? <span className='text-success'> Confirmed</span> : null}
      </div>
  );
}

export default ParticipantConfirm1;
