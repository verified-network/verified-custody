import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

function PromptSignatures(props) {
    const [loading, setLoading] = useState(false);

  const promptSignatures = async () => {
    setLoading(true);
    props.promptSignatures();
    props.custodyContract.promptSignatures().then(res => {
        props.setPromptSignaturesDone(true);
      console.log("App.js custodyContract.promptSignatures", res);
    }).catch(error => {
      console.log("App.js custodyContract.promptSignatures error", error);
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
      <div className='mb-2 mt-3 flex align-items-center'>
        <Button disabled={loading || props.disabled} onClick={promptSignatures}>Prompt Signatures {loading ? <Spinner animation="border" size="sm" /> : null}</Button> 
        {props.promptSignaturesDone ? <span className='text-success'> Done</span> : null}
      </div>
  );
}

export default PromptSignatures;
