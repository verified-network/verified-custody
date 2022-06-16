import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

function AddParticipant(props) {
    const [loading, setLoading] = useState(false);

  const addParticipant = async () => {
    setLoading(true);
    props.custodyContract.addParticipant(props.participant).then(res => {
      console.log("App.js custodyContract.addParticipant", res);
      props.setParticipantAdded(true);
    }).catch(error => {
      console.log("App.js custodyContract.addParticipant error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <input value={props.participant} onChange={e => props.setParticipant(e.target.value)} />
        <Button disabled={loading || props.disabled} onClick={addParticipant}>Add Participant {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.participantAdded ? <span className='text-success'> Participant Added</span> : null}
      </div>
  );
}

export default AddParticipant;
