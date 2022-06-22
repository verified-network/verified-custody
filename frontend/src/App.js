import "./App.css";
import { useEffect, useState } from "react";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import CustodyContractServiceCreator, {
} from "./contracts/CustodyContractServiceCreator";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Spinner } from "react-bootstrap";
import CreateVault from "./buttons/createVault";
import DefineQuorum from "./buttons/defineQuorum";
import PromptSignatures from "./buttons/promptSignatures";
import AddParticipant from "./buttons/addParticipant";
import GetShards from "./buttons/getShards";
import TotalSignersModal from "./components/totalSignersModal";

export const isDev = process.env.NODE_ENV === "development";

const signersWallets = {
  0: "ozone chief cave farm damage sweet inhale display inch purity leader brick", // 0x6d1965B856fc6ca7d322178b4554374DE76472A6
  1: "recycle unaware fruit danger poverty card tag river protect sock asset fabric", // 0x8e83c3c8EabC4dfCcc590A6c3C661BAC2a2fbf52
  2: "distance crisp session broom rail valley abuse eternal gorilla ghost record someone", // 0x1AF711dF8b66Da986095A646Ceeb72EbA715CAd2
  3: "dinosaur asset primary face network obvious inhale final benefit major pottery tree", // 0x8226bbAEb1B8818977e93928599aa3A3ff31a442
  4: "marriage swift hobby kitchen tip gasp exist path hundred vanish describe renew", // 0x019f2D77e4a8CA568fC8B2AB17f3C5a6aD18214c
};

function App() {
  const [totalSigners, setTotalSigners] = useState();
  const [signers, setSigners] = useState({});
  const [minimumSigners, setMinimumSigners] = useState();

  const [wallet, setWallet] = useState();
  const [shares, setShares] = useState([]);

  const signersArray = Object.values(signers);

  useEffect(() => {
    if(signersArray.length && !wallet) {
      const contract = new CustodyContractServiceCreator(signersArray[0].mnemonic);
      const wallet = contract.getWallet();
      setWallet(wallet);
    }
  }, [signersArray]);

  useEffect(() => {
    if (signers && minimumSigners && wallet) {
      createShards();
    }
  }, [signers, minimumSigners, wallet]);

  const createShards = () => {
    var shares = window.secrets.share(
      wallet.privateKey.substring(minimumSigners),
      totalSigners,
      minimumSigners
    );
    setShares(shares);
    console.log("PrivateKey", shares);
  };

  const onChangeTotalSigners = (value, minimumSigners) => {
    const signers = {};
    const totalSigners = Number(value);
    const signersWalletsKeys = Object.keys(signersWallets);
    signersWalletsKeys.map((s, i) => {
      if (totalSigners >= i + 1) {
        signers[s] = {
          mnemonic: signersWallets[s],
          email: !i ? "creator@email.com" : `signer${s}@email.com`,
          id: `id_${i}`,
          pin: `123${i}`
        };
      }
    });
    setSigners(signers);
    setTotalSigners(value);
    setMinimumSigners(minimumSigners);
  };

  if (!totalSigners) {
    return (
      <TotalSignersModal
        totalSigners={totalSigners}
        setTotalSigners={onChangeTotalSigners}
      />
    );
  }

  if(!shares.length || !wallet || !signersArray.length || !totalSigners) {
    return <div style={{height: '100vh'}} className="col-12 d-flex justify-content-center align-items-center">
      <Spinner animation="border" />
    </div>
  }

  console.log("App.js Render", { totalSigners, signers, shares });

  return (
    <Container className="p-4 col-12">
      <div>
        <div>
          <b>Private Key: </b> {wallet?.privateKey}
        </div>
        {shares.map((share, index) => {
          return (
            <div key={share}>
              <b>Share {index}</b> - {share}
            </div>
          );
        })}
      </div>

      <div className="col-12 mt-4 d-flex flex-wrap">
        {signersArray.map((item, index) => {
          const isCreator = !index;
          const creator = signersArray[0];
          const custodyContract = new CustodyContractServiceCreator(item.mnemonic, creator.email, item.email, item.id);
          return (
            <div
              key={item.email}
              className={`col-12 col-md-6 col-lg-4 border-bottom py-4 ${
                index + 1 === signersArray.length ? "" : "border-end"
              }`}
            >
              <div className="d-flex justify-around">
                <div
                  style={{ flex: "1" }}
                  className="d-flex justify-content-center "
                >
                  <h4>
                    {isCreator ? "Creator" : `Signer ${index}`} ({item.email})
                  </h4>
                </div>
              </div>
              <div className="d-flex flex-column ps-4">
                <CreateVault
                  custodyContract={custodyContract}
                  {...item}
                />
               {isCreator ? <>
                <DefineQuorum
                  custodyContract={custodyContract}
                  minimumSigners={minimumSigners}
                  {...item}
                  // disabled={!vaultCreated}
                />
                 {signersArray.map((participant, i) => {
                  const custodyContractParticipant = new CustodyContractServiceCreator(participant.mnemonic, creator.email, participant.email, participant.id);
                  return <AddParticipant
                    key={i}
                    custodyContract={custodyContract}
                    custodyContractParticipant={custodyContractParticipant}
                    shares={shares}
                    participant={participant}
                    index={i}
                    share={shares[i]}
                    isCreator={!i}
                  />
                 })}
                <PromptSignatures
                  custodyContract={custodyContract}
                  signersArray={signersArray}
                  minimumSigners={minimumSigners}
                  privateKey={wallet.privateKey}
                  {...item}
                />
                </> : null}
              </div>
            </div>
          );
        })}
      </div>
      <NotificationContainer />
    </Container>
  );
}

export default App;
