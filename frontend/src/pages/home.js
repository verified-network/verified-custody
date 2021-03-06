import { useEffect, useState } from "react";
import CustodyContractService from "../contracts/CustodyContractService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import CreateVault from "../buttons/createVault";
import PromptSignatures from "../buttons/promptSignatures";
import AddParticipant from "../buttons/addParticipant";
import TotalSignersModal from "../components/totalSignersModal";
import { isDev } from "../App";
import WalletInfo from "../components/walletInfo";
import { useAppData } from "../contexts/appData";
const ethers = require("ethers");

const signersMnemonics = JSON.parse(process.env.REACT_APP_MNEMONICS);

function HomePage() {
  const [totalSigners, setTotalSigners] = useState();
  const [minimumSigners, setMinimumSigners] = useState();
  const [privateKey, setPrivateKey] = useState();
  const [shares, setShares] = useState([]);
  const [quorumDefined, setQuorumDefined] = useState(false);

  const {signers, setSigners, loadingBalances} = useAppData();

  const signersArray = Object.values(signers);

  useEffect(() => {
    let randomWallet = ethers.Wallet.createRandom();
    setPrivateKey(randomWallet.privateKey);
    console.log('Json', JSON.parse(process.env.REACT_APP_MNEMONICS))
  }, []);

  useEffect(() => {
    if (minimumSigners && privateKey) {
      createShards();
    }
  }, [minimumSigners, privateKey]);

  const createShards = () => {
    var shares = window.secrets.share(
      privateKey.substring(minimumSigners),
      totalSigners,
      minimumSigners
    );
    setShares(shares);
  };

  const getContract = (data) => {
    return new CustodyContractService(data.mnemonic, data.id);
  };

  const onChangeTotalSigners = (value, minimumSigners) => {
    const signers = {};
    const totalSigners = Number(value);
    const signersWalletsKeys = Object.keys(signersMnemonics);
    signersWalletsKeys.map((s, i) => {
      if (totalSigners >= i + 1) {
        const item = {
          mnemonic: signersMnemonics[s],
          // email: !i ? "creator@email.com" : `signer${s}@email.com`,
          id: `id_${i}`,
        //   pin: `123${i}`,
        };
        item.contract = getContract(item);
        if (isDev) {
            item.pin = `123${i}`;
          item.defaultEmail = !i
            ? "signer@email.com"
            : `cosigner${s}@email.com`;
        }
        signers[s] = item;
      }
    });
    setSigners(signers);
    setTotalSigners(value);
    setMinimumSigners(minimumSigners);
  };

  const onEmailChange = (email, index) => {
    const newSigners = { ...signers };
    const signerItem = newSigners[index.toString()];
    signerItem.email = email;
    newSigners[index.toString()] = signerItem;
    setSigners(newSigners);
  };

  const onParticipantAdded = (index) => {
    const newSigners = { ...signers};
    const signerItem = newSigners[index.toString()];
    signerItem.isAdded = true;
    newSigners[index.toString()] = signerItem;
    const creator = newSigners["0"];
    creator.participants = (creator.participants || 0) + 1;
    newSigners["0"] = creator;
    setSigners(newSigners);
  };

  if (!totalSigners) {
    return (
      <TotalSignersModal
        totalSigners={totalSigners}
        setTotalSigners={onChangeTotalSigners}
      />
    );
  }

  if (!shares.length || !privateKey || !signersArray.length || !totalSigners || loadingBalances) {
    return (
      <div
        style={{ height: "100vh" }}
        className="col-12 d-flex justify-content-center align-items-center"
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="fw-bold mb-3">Verified Custody</h3>
      </div>

      <div className="shadow p-3 rounded-3">
        <div className="d-flex mb-2">
          <div className="me-4">
            <b>Total Signers:</b> {totalSigners}
          </div>
          <div>
            <b>Minimum signatures required:</b> {minimumSigners}
          </div>
        </div>
        <div>
          <b>Private Key: </b> {privateKey}
        </div>
        {shares.map((share, index) => {
          return (
            <div key={share} className="mb-1">
              <b>Shard {index}</b> - {share}
            </div>
          );
        })}
      </div>

      <div className="col-12 mt-4 d-flex flex-wrap">
        {signersArray.map((item, index) => {
          const isCreator = !index;
          const creator = signersArray[0];
          return (
            <div
              key={item.email}
              className={`col-12 col-md-6 col-lg-4 mb-4 ${
                index + 1 === signersArray.length ? "" : "pe-4"
              }`}
            >
            <div
              key={item.email}
              className={`py-4 shadow rounded-3`}
              style={{height: '100%'}}
            >
              <div className="d-flex justify-around">
                <div
                  style={{ flex: "1" }}
                  className="d-flex justify-content-center "
                >
                  <h4>
                    {isCreator ? "Signer" : `Co-Signer ${index}`}
                    {/* {item.email ? `(${item.email})` : ''} */}
                  </h4>
                </div>
              </div>
              <WalletInfo {...item} index={index} />
              <div className="d-flex flex-column px-4">
                <CreateVault
                  onEmailChange={(email) => onEmailChange(email, index)}
                  minimumSigners={minimumSigners}
                    setQuorumDefined={setQuorumDefined}
                    isCreator={isCreator}
                    index={index}
                  {...item}
                />
                {isCreator ? (
                  <>
                    {quorumDefined
                      ? signersArray.map((participant, i) => {
                          if (!participant.email) return false;
                          return (
                            <AddParticipant
                              key={i}
                              participant={participant}
                              creator={creator}
                              index={i}
                              share={shares[i]}
                              isCreator={!i}
                              onParticipantAdded={() => onParticipantAdded(i)}
                              minimumSigners={minimumSigners}
                              mainIndex={index}
                            />
                          );
                        })
                      : null}
                    {item.participants >= minimumSigners ? (
                      <PromptSignatures
                        signersArray={signersArray}
                        minimumSigners={minimumSigners}
                        privateKey={privateKey}
                        {...item}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HomePage;
