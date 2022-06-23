import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import CustodyContractService from '../contracts/CustodyContractService';

function DefineQuorum(props) {
    const [loading, setLoading] = useState(false);
    

  const defineQuorum = async () => {
    setLoading(true);
    const custodyContract = new CustodyContractService(props.mnemonic, props.id);

    custodyContract.defineQuorum(props.email, props.minimumSigners.toString()).then(res => {
        console.log("App.js custodyContract.defineQuorum", res);
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          props.setQuorumDefined(true);
        }
      }).catch(error => {
        console.log("App.js custodyContract.defineQuorum error", error);
      }).finally(() => {
        setLoading(false);
    })
  }

  if(!props.email) return;

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button 
          disabled={loading || props.quorumDefined} 
          onClick={defineQuorum}>Define Quorum {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.quorumDefined ? <span className='text-success'> Quorum Defined {props.minimumSigners}</span> : null}
      </div>
  );
}

export default DefineQuorum;
