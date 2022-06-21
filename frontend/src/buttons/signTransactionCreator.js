import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function SignTransactionCreator(props) {
    const [loading, setLoading] = useState(false);

  const signTransaction = async () => {
    setLoading(true);
    props.custodyContract.signTransaction(props.txid).then(res => {
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          props.setSignTransactionCreatorDone(true);
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
        <Button disabled={loading || !props.txid} onClick={signTransaction}>Sign Transaction Participant 1 {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.signTransactionCreatorDone ? <span className='text-success'> Signed by creator</span> : null}
      </div>
  );
}

export default SignTransactionCreator;
