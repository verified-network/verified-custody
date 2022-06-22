import { CustodyContract, Provider, VerifiedWallet } from '@verified-network/verified-sdk';
const ethers = require("ethers");

const mnemonicDefault = 'ozone chief cave farm damage sweet inhale display inch purity leader brick';
export const API_KEY = '7465b99634184765843e4f232545788f';

export const configs = {
  creatorEmail: 'creator3@email.com',
  creatorId: 'abc12341',
  creatorPin: '1234',
  participantEmail: 'participant3@email.com',
  participantPin: '5678',
  participantId: 'xyz12341',
  network: 'goerli'
}

class CustodyContractServiceCreator {
  constructor(mnemonic, creatorEmail, participantEmail, id) {
    this.wallet = VerifiedWallet.importWallet(mnemonic || mnemonicDefault).setProvider(Provider.infuraProvider(configs.network, API_KEY));
    
    console.log('CustodyContractServiceCreator constructor wallet', this.wallet);

    this.userAddress = this.wallet.address;
    this.creatorEmail = creatorEmail;
    this.participantEmail = participantEmail;
    this.id = id;
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
    return this.vault.createVault(this.participantEmail, this.id);
  }

  defineQuorum(_minParticipants) {
    return this.vault.defineQuorum(this.creatorEmail, _minParticipants);
  }

  addParticipant(_participant, share) {
    return this.vault.addParticipant(this.creatorEmail, _participant, share);
  }

  confirmParticipant(_pin) {
    return this.vault.confirmParticipant(this.creatorEmail, this.participantEmail, _pin);
  }

  promptSignatures() {
    console.log('CustodyContractServiceCreator defineQuorum',this.creatorEmail, this.participantEmail, this.userAddress);
    return this.vault.promptSignatures(this.creatorEmail);
  }

  signTransaction(_participant, _tx, _pin) {
    console.log('CustodyContractServiceCreator signTransaction',this.creatorEmail, _participant, _tx, _pin);
    return this.vault.signTransaction(this.creatorEmail, _participant, _tx, _pin);
  }

  checkQuorum(_txid) {
    console.log('CustodyContractServiceCreator signTransaction',this.creatorEmail, this.participantEmail);
    return this.vault.checkQuorum(this.creatorEmail, this.participantEmail, _txid);
  }

  getShards(_txid) {
    return this.vault.getShards(this.creatorEmail, _txid);
  }

  getWallet = () => {
    return this.wallet;
  };
}

export default CustodyContractServiceCreator;
