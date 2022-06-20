import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { configs } from '../contracts/CustodyContractServiceCreator';

function SignTransactionsignParticipant(props) {
    const [loading, setLoading] = useState(false);

  const signTransaction = async () => {
    setLoading(true);
    props.custodyContract.signTransaction(props.txid).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        props.setSignTransactionParticipantDone(true);
      }
      console.log("App.js custodyContract.signTransaction", res);
    }).catch(error => {
      console.log("App.js custodyContract.signTransaction error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={signTransaction}>Sign Transaction Participant 2 {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.signTransactionParticipantDone ? <span className='text-success'> Signed by participant</span> : null}
      </div>
  );
}

export default SignTransactionsignParticipant;
