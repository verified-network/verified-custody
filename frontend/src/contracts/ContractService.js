import { Provider, VerifiedWallet } from '@verified-network/verified-sdk';

const mnemonic = 'shoe steak sample jeans motion air hard input thrive spy trumpet snack';
const network = 'rinkeby';
export const API_KEY = 'KutMkRYKetdUi4mA7bJeRzVYE52aIQxx';

class ContractService {
  static walletCache = null;

  constructor() {
    if (!ContractService.walletCache) {
      ContractService.walletCache = VerifiedWallet.importWallet(mnemonic).setProvider(Provider.alchemyProvider(network, API_KEY));
    }

    this.wallet = ContractService.walletCache;
  }

  getWallet = () => {
    return this.wallet;
  };
}

export default ContractService;
