import "./App.css";
import { useEffect, useState } from "react";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications';
import CustodyContractServiceCreator, { configs } from "./contracts/CustodyContractServiceCreator";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import CreateVault from "./buttons/createVault";
import DefineQuorum from "./buttons/defineQuorum";
import AddParticipantCreator from "./buttons/addParticipantCreator";
import ParticipantConfirm1 from "./buttons/participantConfirm1";
import ParticipantConfirm2 from "./buttons/participantConfirm2";
import PromptSignatures from "./buttons/promptSignatures";
import CustodyContractServiceParticipant from "./contracts/CustodyContractServiceParticipant";
import CreateVaultParticipant from "./buttons/createVaultParticipant";
import SignTransactionCreator from "./buttons/signTransactionCreator";
import SignTransactionsignParticipant from "./buttons/signTransactionParticipant";
import AddParticipant from "./buttons/addParticipant";
import CheckQuorum from "./buttons/checkQuorum";
import GetShards from "./buttons/getShards";

function App() {
  const [custodyContract, setCustodyContract] = useState();
  const [custodyContractParticipant, setCustodyContractParticipant] = useState();
  const [wallet, setWallet] = useState();
  const [shares, setShares] = useState([]);
  const [txid, setTxid] = useState("");
  const [vaultCreated, setVaultCreated] = useState(false);
  const [vaultCreatedParticipant, setVaultCreatedParticipant] = useState(false);
  const [quorumDefined, setQuorumDefined] = useState(false);
  const [participantAdded, setParticipantAdded] = useState(false);
  const [participantCreatorAdded, setParticipantCreatorAdded] = useState(false);
  const [participant1Confirmed, setParticipant1Confirmed] = useState(false);
  const [participant2Confirmed, setParticipant2Confirmed] = useState(false);
  const [promptSignaturesDone, setPromptSignaturesDone] = useState(false);
  const [checkQuorumDone, setCheckQuorumDone] = useState(false);
  const [addSignTransactionListener, setaddSignTransactionListener] = useState();

  useEffect(() => {
    const contract = new CustodyContractServiceCreator();
    const wallet = contract.getWallet();
    setWallet(wallet);
    setCustodyContract(contract);
    const contractParticipant = new CustodyContractServiceParticipant();
    setCustodyContractParticipant(contractParticipant);
  }, []);

  useEffect(() => {
    // if (custodyContractParticipant) {
    //   const vault = custodyContractParticipant.getVault();

    //   vault.notifyNewParticipant((res) => {
    //     const result = res.response.result;
    //     console.log("App.js notifyNewParticipant custodyContractParticipant", res);
    //   })
    // }
  }, [custodyContractParticipant]);

  useEffect(() => {
    if (custodyContract) {
      createShards();
      // const vault = custodyContract.getVault();

      // vault.notifyNewParticipant((res) => {
      //   const result = res.response.result;
      //   console.log("App.js notifyNewParticipant custodyContract", res);
      // })
    }
  }, [custodyContract]);

  const createShards = () => {
    console.log("PrivateKey", window.secrets);
    var shares = window.secrets.share(wallet.privateKey.substring(2), 3, 2);
    setShares(shares);
    console.log("Key share 1: " + shares[0]);
    console.log("Key share 2: " + shares[1]);
    console.log("Key share 3: " + shares[2]);
  };

  const promptSignatures = async () => {
    // const vault = custodyContract.getVault();
    // console.log("App.js promptSignatures", vault.getEvent);

    // vault.getEvent('NewTransaction', (res) => {
    //   console.log("App.js custodyContract.NewTransaction", res);
    //   setTxid(res.returnValues.txid);
    // });
  };

  return (
    <Container className="p-4 col-12">
      <div>
      <div>
        {/* <b>Private Key: </b> {wallet?.privateKey} */}
      </div>
        {shares.map((share, index) => {
          return (
            <div key={share}>
              <b>Share {index}</b> - {share}
            </div>
          );
        })}
      </div>

      <div className=" col-12 mt-4">
        <div className="d-flex justify-around">
          <div style={{ flex: "1" }} className="d-flex justify-content-center">
            <h4>Creator ({configs.creatorEmail})</h4>
          </div>
          <div style={{ flex: "1" }} className="d-flex justify-content-center">
            <h4>Participant ({configs.participantEmail})</h4>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-around">
          <div style={{ flex: "1" }} className="border-end me-4">
            <CreateVault
              custodyContract={custodyContract}
              vaultCreated={vaultCreated}
              setVaultCreated={setVaultCreated}
            />
            <DefineQuorum
              custodyContract={custodyContract}
              quorumDefined={quorumDefined}
              setQuorumDefined={setQuorumDefined}
              disabled={!vaultCreated}
            />
            <AddParticipantCreator
              custodyContract={custodyContract}
              participantAdded={participantCreatorAdded}
              setParticipantAdded={setParticipantCreatorAdded}
              setParticipant1Confirmed={setParticipant1Confirmed}
              disabled={!quorumDefined}
              shares={shares}
            />
            <AddParticipant
              custodyContract={custodyContract}
              custodyContractParticipant={custodyContractParticipant}
              participantAdded={participantAdded}
              setParticipantAdded={setParticipantAdded}
              setParticipant2Confirmed={setParticipant2Confirmed}
              disabled={!quorumDefined}
              shares={shares}
            />
            {/* <ParticipantConfirm1
              custodyContract={custodyContract}
              participant1Confirmed={participant1Confirmed}
              setParticipant1Confirmed={setParticipant1Confirmed}
              shares={shares}
              disabled={!participantAdded}
            /> */}
            <PromptSignatures
              custodyContract={custodyContract}
              custodyContractParticipant={custodyContractParticipant}
              promptSignaturesDone={promptSignaturesDone}
              setPromptSignaturesDone={setPromptSignaturesDone}
              shares={shares}
              disabled={!participantAdded}
              promptSignatures={promptSignatures}
              setTxid={setTxid}
              txid={txid}
              setaddSignTransactionListener={setaddSignTransactionListener}
            />
            {/* <SignTransactionCreator
              custodyContract={custodyContract}
              txid={txid}
              signTransactionCreatorDone={signTransactionCreatorDone}
              setSignTransactionCreatorDone={setSignTransactionCreatorDone}
            /> */}
             <CheckQuorum
              custodyContract={custodyContract}
              txid={txid}
              checkQuorumDone={checkQuorumDone}
              setCheckQuorumDone={setCheckQuorumDone}
              addSignTransactionListener={addSignTransactionListener}
              privateKey={wallet?.privateKey}
            />
            {/*<GetShards
              custodyContract={custodyContract}
              txid={txid}
              checkQuorumDone={checkQuorumDone}
              setCheckQuorumDone={setCheckQuorumDone}
            /> */}
          </div>
          <div style={{ flex: "1" }} className="">
            <div className="my-2">
              <div>txid: {txid}</div>
            </div>
            <CreateVaultParticipant
              custodyContract={custodyContractParticipant}
              vaultCreated={vaultCreatedParticipant}
              setVaultCreated={setVaultCreatedParticipant}
            />
            {/* <ParticipantConfirm2
              custodyContract={custodyContractParticipant}
              participant2Confirmed={participant2Confirmed}
              setParticipant2Confirmed={setParticipant2Confirmed}
              shares={shares}
              disabled={!participantCreatorAdded}
            /> */}
            {/* <SignTransactionsignParticipant
              custodyContract={custodyContractParticipant}
              txid={txid}
              signTransactionParticipantDone={signTransactionParticipantDone}
              setSignTransactionParticipantDone={setSignTransactionParticipantDone}
            /> */}
          </div>
        </div>
      </div>
      <NotificationContainer/>
    </Container>
  );
}

export default App;
