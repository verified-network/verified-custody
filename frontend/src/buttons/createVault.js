import React, { useState } from 'react';
import { Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import CustodyContractServiceCreator from '../contracts/CustodyContractServiceCreator';

function CreateVault(props) {
    const [loading, setLoading] = useState(false);
    const [vaultCreated, setVaultCreated] = useState(false);
    const [email, setEmail] = useState(props.defaultEmail || '');

  const createVault = async (e) => {
    e.preventDefault();
    if(!email) return;
    setLoading(true);
    const custodyContract = new CustodyContractServiceCreator(props.mnemonic);
      custodyContract.createVault(email, props.id).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        setVaultCreated(true);
        props.onEmailChange(email);
        console.log('CreateVault contract', props.contract);
      }
      console.log(`App.js custodyContract.createVault ${props.email}`, res);
    }).catch(error => {
      console.log(`App.js custodyContract.createVault ${props.email} error`, error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Form onSubmit={createVault}>
        <InputGroup className="mb-3">
          <Form.Control
            value={email || props.email}
            onChange={e => setEmail(e.target.value)}
            required={true}
            disabled={loading || props.email}
            type="email"
            placeholder="Enter email"
            aria-label="Enter email"
            aria-describedby="basic-addon2"
          />
          <Button disabled={loading || !email || props.email} type="submit">{props.email ? "Vault Created" : "Create Vault"} {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        </InputGroup>
        </Form>
        {vaultCreated ? <span className='text-success'> Vault Created</span> : null}
      </div>
  );
}

export default CreateVault;
