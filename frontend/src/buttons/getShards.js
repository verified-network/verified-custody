import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

function GetShards(props) {
    const [loading, setLoading] = useState(false);
    const [shards, setShares] = useState(false);

  const getShards = async () => {
    setLoading(true);
    props.custodyContract.getShards(props.txid).then(res => {
      if(res.status) {
        NotificationManager.error(res.message);
      } else {
        const result = res.response.result;
        const shards = result.filter(item => item !== '')
        var comb = window.secrets.combine(shards);
        setShares(comb);
      }
      console.log("App.js custodyContract.getShards", {res, comb});
    }).catch(error => {
      console.log("App.js custodyContract.getShards error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={getShards}>Get Shards {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {shards ? <span className='text-success'> 
          {' '} Private Key by Shards: {shards}
        </span> : null}
      </div>
  );
}

export default GetShards;