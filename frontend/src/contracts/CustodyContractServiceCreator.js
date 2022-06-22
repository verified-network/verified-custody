import { CustodyContract, Provider, VerifiedWallet } from '@verified-network/verified-sdk';
const ethers = require("ethers");

const mnemonic = 'ozone chief cave farm damage sweet inhale display inch purity leader brick';
export const API_KEY = '7465b99634184765843e4f232545788f';

export const configs = {
  creatorEmail: 'creator@email.com',
  creatorId: 'abc1234',
  creatorPin: '1234',
  participantEmail: 'participant@email.com',
  participantPin: '5678',
  participantId: 'xyz1234',
  network: 'goerli'
}

class CustodyContractServiceCreator {
  constructor() {
    this.wallet = VerifiedWallet.importWallet(mnemonic).setProvider(Provider.infuraProvider(configs.network, API_KEY));
    
    console.log('CustodyContractServiceCreator constructor wallet', this.wallet);

    this.userAddress = this.wallet.address;
    this.vault = new CustodyContract(this.wallet);
  }

  getCreator() {
    this.vault.getCreator(configs.creatorEmail).then(res => {
        console.log("getCreator", res)
    });
  }

  getVault() {
    return this.vault;
  }

  createVault() {
    return this.vault.createVault(configs.creatorEmail, configs.creatorId, {from: this.userAddress});
  }

  defineQuorum(_minParticipants) {
    return this.vault.defineQuorum(configs.creatorEmail, _minParticipants, {from: this.userAddress});
  }

  addParticipant(_participant, share) {
    console.log('CustodyContractServiceCreator addParticipant', {_participant, share});

    return this.vault.addParticipant(configs.creatorEmail, _participant, share, {from: this.userAddress});
  }

  confirmParticipant() {
    return this.vault.confirmParticipant(configs.creatorEmail, configs.creatorEmail, configs.creatorPin, {from: this.userAddress});
  }

  promptSignatures() {
    return this.vault.promptSignatures(configs.creatorEmail, {from: this.userAddress});
  }

  signTransaction(_tx) {
    return this.vault.signTransaction(configs.creatorEmail, configs.creatorEmail, _tx, configs.creatorPin, {from: this.userAddress});
  }

  checkQuorum(_txid) {
    return this.vault.checkQuorum(configs.creatorEmail, configs.participantEmail, _txid, {from: this.userAddress});
  }

  getShards(_txid) {
    return this.vault.getShards(configs.creatorEmail, _txid, {from: this.userAddress});
  }

  getWallet = () => {
    return this.wallet;
  };
}

export default CustodyContractServiceCreator;
