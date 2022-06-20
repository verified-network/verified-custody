import { CustodyContract, Provider, VerifiedWallet } from '@verified-network/verified-sdk';
import { API_KEY, configs } from './CustodyContractServiceCreator';

const mnemonic = 'recycle unaware fruit danger poverty card tag river protect sock asset fabric';

class CustodyContractServiceParticipant {
  constructor() {
    this.wallet = VerifiedWallet.importWallet(mnemonic).setProvider(Provider.infuraProvider(configs.network, API_KEY));
    console.log('CustodyContractServiceParticipant constructor wallet', this.wallet);
    
    this.userAddress =this.wallet.address;
    this.vault = new CustodyContract(this.wallet);
  }

  getVault() {
    return this.vault;
  }

  createVault() {
    return this.vault.createVault(configs.participantEmail, configs.participantId, {from: this.userAddress});
  }

  confirmParticipant() {
    return this.vault.confirmParticipant(configs.creatorEmail, configs.participantEmail, configs.participantId, {from: this.userAddress});
  }

  signTransaction(_tx) {
    return this.vault.signTransaction(configs.creatorEmail, configs.participantEmail, _tx, configs.participantPin, {from: this.userAddress});
  }

  getWallet = () => {
    return this.wallet;
  };
}

export default CustodyContractServiceParticipant;
