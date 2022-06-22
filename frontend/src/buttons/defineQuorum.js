import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function DefineQuorum(props) {
    const [loading, setLoading] = useState(false);
    const [quorumDefined, setQuorumDefined] = useState(false);

  const defineQuorum = async () => {
    setLoading(true);
    props.custodyContract.defineQuorum(props.minimumSigners.toString()).then(res => {
        console.log("App.js custodyContract.defineQuorum", res);
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          setQuorumDefined(true);
        }
      }).catch(error => {
        console.log("App.js custodyContract.defineQuorum error", error);
      }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button 
          disabled={loading || props.disabled} 
          onClick={defineQuorum}>Define Quorum {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {quorumDefined ? <span className='text-success'> Quorum Defined {props.minimumSigners}</span> : null}
      </div>
  );
}

export default DefineQuorum;
