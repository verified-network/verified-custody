import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { configs } from '../contracts/CustodyContractServiceCreator';

function AddParticipantCreator(props) {
    const [loading, setLoading] = useState(false);

  const addParticipant = async () => {
    setLoading(true);
    props.custodyContract.addParticipant(configs.creatorEmail, props.shares[0]).then(res => {
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
        <Button disabled={loading || props.disabled} onClick={addParticipant}>Add Participant 1 {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.participantAdded ? <span className='text-success'> Participant Added</span> : null}
      </div>
  );
}

export default AddParticipantCreator;
