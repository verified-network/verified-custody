import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

function DefineQuorum(props) {
    const [loading, setLoading] = useState(false);

  const defineQuorum = async () => {
    setLoading(true);
    props.custodyContract.defineQuorum('2').then(res => {
        console.log("App.js custodyContract.defineQuorum", res);
        props.setQuorumDefined(true);
      }).catch(error => {
        console.log("App.js custodyContract.defineQuorum error", error);
      }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={defineQuorum}>Define Quorum {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.quorumDefined ? <span className='text-success'> Quorum Defined 2</span> : null}
      </div>
  );
}

export default DefineQuorum;
