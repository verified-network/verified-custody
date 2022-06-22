import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function CreateVaultParticipant(props) {
    const [loading, setLoading] = useState(false);

  const createVault = async () => {
    setLoading(true);
    props.custodyContract.createVault().then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        props.setVaultCreated(true);
      }
      console.log("App.js custodyContract.createVault", res);
    }).catch(error => {
      console.log("App.js custodyContract.createVault error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading} onClick={createVault}>Create Vault {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.vaultCreated ? <span className='text-success'> Vault Created</span> : null}
      </div>
  );
}

export default CreateVaultParticipant;