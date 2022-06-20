# Verified Custody contract

## Workflow

The Verified Custody contract enables the following workflow.

### Vault creation
1. The signing users (signer and co-signers) creates a vault with its user id (eg, email id) and a messaging token (eg, Firebase messaging token).

### Shard creation
2. The signer creates or imports a wallet and creates shards of its private key. In the sample application, we are using secrets.js to create the shards.

### Defining quorum
3. The signer defines quorum which needs to be a minimum of 2 if the number of key shards (or co-signers) is 3.
4. The signer adds co-signers and their shards to the vault. The number of co-signers should be equal to the number of key shards. This generates the NewParticipant event which is used to notify the co-signers by getting their messaging tokens mapped to their their user ids.

### Shard assignment
5. The signer and each co-signer confirms their participation in the vault by putting in their PIN number.  

### Transaction signing
6. The signer prompts a signature for a transaction which generates a NewTransaction event.
7. Co-signers notified by the NewTransaction event confirms their signature by putting their PIN. This generates the SignTransaction event.
8. When the signer is notified by the SignTransaction event, it checks if quorum is reached.
9. If quorum is reached, the signer gets the shards that are assembled to generate the private key in a secure enclave.
10. The transaction is signed using the private key procured from the secure enclave.

