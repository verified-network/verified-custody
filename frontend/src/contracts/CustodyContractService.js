import { CustodyContract } from '@verified-network/verified-sdk';
import ContractService, { API_KEY } from './ContractService';
// import VaultJson from '@verified-network/verified-sdk/dist/abi/custody/Vault.json'
// import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// const web3 = createAlchemyWeb3(`wss://eth-rinkeby.alchemyapi.io/v2/${API_KEY}`);

class CustodyContractService extends ContractService {
  constructor() {
    super();
    console.log('CustodyContractService constructor wallet', this.getWallet());

    this.userAddress = this.getWallet().address;
    this.vault = new CustodyContract(this.getWallet());
    console.log('CustodyContractService constructor', this.userAddress, this.vault);
    this.creator = 'sainikrishan1999@gmail.com';
    this.id = 'abc1234';
    this.pin = '1234';
  }

  getCreator() {
    this.vault.getCreator(this.creator).then(res => {
        console.log("getCreator", res)
    });
  }

  getVault() {
    return this.vault;
  }

  createVault() {
    return this.vault.createVault(this.creator, this.id);
  }

  defineQuorum(_minParticipants) {
    return this.vault.defineQuorum(this.creator, this.id, _minParticipants);
  }

  addParticipant(_participant) {
    return this.vault.addParticipant(this.creator, this.id, _participant);
  }

  confirmParticipant(_participant, _id, _shard, _pin) {
    const participant = _participant || this.creator;
    const pin = _pin || this.pin;
    const id = _id || this.id;
    return this.vault.confirmParticipant(this.creator, participant, id, _shard, pin);
  }

  promptSignatures() {
    return this.vault.promptSignatures(this.creator, this.id);
  }

  signTransaction(_participant, _tx, _pin) {
    return this.vault.signTransaction(this.creator, _participant, this.id, _tx, _pin);
  }

  checkQuorum(_participant, _txid) {
    return this.vault.checkQuorum(this.creator, this.id, _participant, _txid);
  }

  getShards(_txid) {
    return this.vault.getShards(this.creator, this.id, _txid);
  }
}

export default CustodyContractService;
