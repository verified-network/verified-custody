import { CustodyContract, Provider, VerifiedWallet } from '@verified-network/verified-sdk';

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

class CustodyContractService {
  constructor(mnemonic) {
    this.wallet = VerifiedWallet.importWallet(mnemonic || mnemonicDefault).setProvider(Provider.infuraProvider(configs.network, API_KEY));
    
    this.userAddress = this.wallet.address;
    this.creatorEmail = null;
    this.participantEmail = null;
    this.id = null;
    this.vault = new CustodyContract(this.wallet);
  }

  getCreator() {
    this.vault.getCreator(configs.creatorEmail).then(res => {
    });
  }

  getVault() {
    return this.vault;
  }

  createVault(_email, _id) {
    return this.vault.createVault(_email, _id);
  }

  defineQuorum(_creator, _minParticipants) {
    return this.vault.defineQuorum(_creator, _minParticipants);
  }

  addParticipant(_creator, _participant, _share) {
    return this.vault.addParticipant(_creator, _participant, _share);
  }

  confirmParticipant(_creator, _participant, _pin) {
    return this.vault.confirmParticipant(_creator, _participant, _pin);
  }

  promptSignatures(_creator) {
    return this.vault.promptSignatures(_creator);
  }

  signTransaction(_creator, _participant, _tx, _pin) {
    return this.vault.signTransaction(_creator, _participant, _tx, _pin);
  }

  checkQuorum(_creator, _participant, _txid) {
    return this.vault.checkQuorum(_creator, _participant, _txid);
  }

  getShards(_creator, _txid) {
    return this.vault.getShards(_creator, _txid);
  }

  getWallet = () => {
    return this.wallet;
  };
}

export default CustodyContractService;
