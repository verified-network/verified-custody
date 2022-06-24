import React, { useEffect, useState } from 'react';
import InsufficientFundModal from '../components/insufficientFundModal';
import CustodyContractService from '../contracts/CustodyContractService';

const AppDataContext = React.createContext(null);

const AppDataProvider = (props) => {
  const [signers, setSigners] = useState({});
  const [walletBalances, setWalletBalances] = useState({});
  const [walletAddresses, setWalletAddresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if(signers['0']) {
      fetchBalances();
    }
  }, [signers]);

  const fetchBalances = async () => {
    const balances = await getBalances();
    const newBalances = {};
    const newAddresses = {};
    balances.map((b, index) => {
      newBalances[index] = b.balance;
      newAddresses[index] = b.address;
    });
    setWalletBalances(newBalances);
    setWalletAddresses(newAddresses);
    setLoading(false);
    console.log("AppData fetchBalances", newBalances);
  }

  const getBalances = async () => {
    const signersKeys = Object.keys(signers);
    const promises = signersKeys.map((item, index) => {
      return getBalance(index);
    });
    return Promise.all(promises);
  }

  const getBalance = async (index) => {
    const walletItem = signers[index];
    const contract = new CustodyContractService(walletItem.mnemonic);
    const wallet = contract.getWallet();
    const address = wallet.address;
    const balance = await contract.getBalance();
    return {balance, address};
  }

  const fetchOneBalance = async (index) => {
    const balance = await getBalance(index);
    const newBalances = {...walletBalances};
    newBalances[index] = balance;
    setWalletBalances(newBalances);
  }

  const showInsufficientFundModal = (index) => {
    setShowModal(`${index}`);
  }

  const values = {
    signers, 
    setSigners,
    walletBalances,
    walletAddresses,
    loadingBalances: loading,
    fetchOneBalance,
    showInsufficientFundModal
  };

  return (
    <AppDataContext.Provider value={{ ...values }} {...props}>
      {props.children}
      <InsufficientFundModal address={walletAddresses[showModal]} show={showModal} setShow={setShowModal} />
    </AppDataContext.Provider>
  );
};

const useAppData = () => React.useContext(AppDataContext);

export default AppDataContext;
export { AppDataProvider, useAppData };
