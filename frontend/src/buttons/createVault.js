import React, { useState } from 'react';
import { Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { useAppData } from '../contexts/appData';
import CustodyContractService from '../contracts/CustodyContractService';
import { isBalanceLow } from '../utils';

function CreateVault(props) {
    const [loading, setLoading] = useState(false);
    const [vaultCreated, setVaultCreated] = useState(false);
    const [email, setEmail] = useState(props.email || props.defaultEmail || '');

    const {walletBalances, showInsufficientFundModal} = useAppData();

    const balance = walletBalances[props.index];

  const createVault = async (e) => {
    e.preventDefault();
    if(!email) return;
    if(isBalanceLow(balance)) {
      showInsufficientFundModal(props.index)
      return;
    }
    setLoading(true);
    const custodyContract = new CustodyContractService(props.mnemonic);
      custodyContract.createVault(email, props.id).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
        setLoading(false);
      } else {
        if(props.isCreator) {
          defineQuorum();
        } else {
          setVaultCreated(true);
          props.onEmailChange(email);
          setLoading(false);
        }
        console.log('CreateVault contract', props.contract);
      }
      console.log(`App.js custodyContract.createVault ${email}`, res);
    }).catch(error => {
      setLoading(false);
      console.log(`App.js custodyContract.createVault ${email} error`, error);
    });
  }

  const defineQuorum = async () => {
    setLoading(true);
    const custodyContract = new CustodyContractService(props.mnemonic, props.id);

    custodyContract.defineQuorum(email, props.minimumSigners.toString()).then(res => {
        console.log("App.js custodyContract.defineQuorum", res);
        if(res.status) {
          NotificationManager.error(res.message);
        } else {
          props.setQuorumDefined(true);
          setVaultCreated(true);
          props.onEmailChange(email);
        }
      }).catch(error => {
        console.log("App.js custodyContract.defineQuorum error", error);
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
