import { CustodyContract, Provider, VerifiedWallet } from '@verified-network/verified-sdk';
import { ethers } from 'ethers';

export const network = 'goerli';

class CustodyContractService {
  constructor(mnemonic) {
    const provider = process.env.REACT_APP_PROVIDER_TYPE === 'infura' ? Provider.infuraProvider : Provider.alchemyProvider
    this.wallet = VerifiedWallet.importWallet(mnemonic).setProvider(provider(network, process.env.REACT_APP_API_KEY));
    
    this.userAddress = this.wallet.address;
    this.creatorEmail = null;
    this.participantEmail = null;
    this.id = null;
    this.vault = new CustodyContract(this.wallet);
  }

  async getBalance() {
    const balance = await this.wallet.getBalance();
    const balanceEth = ethers.utils.formatEther(balance);
    return Number(balanceEth).toFixed(4);
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
