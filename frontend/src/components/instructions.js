import React from "react";

function Instructions(props) {
  return (
    <div className="shadow p-3 rounded-3 mb-4">
      <b>Instructions to use this demo app -</b>
      <div>1. The signer and it’s co-signers have to create their Vaults.</div>
      <div>
        2. The signer then has to add co-signers to its vault. Co-signers
        confirm their participation.
      </div>
      <div>
        3. The signer can then sign transactions. This will prompt the
        co-signers to confirm with their PINs.
      </div>
    </div>
  );
}

export default Instructions;
