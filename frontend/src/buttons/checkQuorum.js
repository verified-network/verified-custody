import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function CheckQuorum(props) {
    const [loading, setLoading] = useState(false);

  const checkQuorum = async () => {
    setLoading(true);
    props.custodyContract.checkQuorum(props.txid).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        props.setCheckQuorumDone(res);
      }
      console.log("App.js custodyContract.checkQuorum", res);
    }).catch(error => {
      console.log("App.js custodyContract.checkQuorum error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={checkQuorum}>Check Quorum {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.checkQuorumDone ? <span className='text-success'> {props.checkQuorumDone ? "True" : "False"} </span> : null}
      </div>
  );
}

export default CheckQuorum;
