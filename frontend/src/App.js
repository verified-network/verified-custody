import "./App.css";
import { useEffect, useState } from "react";
import CustodyContractService from "./contracts/CustodyContractService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button } from "react-bootstrap";
import CreateVault from "./buttons/createVault";
import DefineQuorum from "./buttons/defineQuorum";
import AddParticipant from "./buttons/addParticipant";
import ParticipantConfirm1 from "./buttons/participantConfirm1";
import ParticipantConfirm2 from "./buttons/participantConfirm2";
import PromptSignatures from "./buttons/promptSignatures";

export const participantEmail = "participant@email.com";
export const participantPin = "5678";
export const participantId = "xyz1234";

function App() {
  const [custodyContract, setCustodyContract] = useState();
  const [wallet, setWallet] = useState();
  const [shares, setShares] = useState([]);
  const [participant, setParticipant] = useState(participantEmail);
  const [txid, setTxid] = useState("");
  const [vaultCreated, setVaultCreated] = useState(false);
  const [quorumDefined, setQuorumDefined] = useState(false);
  const [participantAdded, setParticipantAdded] = useState(false);
  const [participant1Confirmed, setParticipant1Confirmed] = useState(false);
  const [participant2Confirmed, setParticipant2Confirmed] = useState(false);
  const [promptSignaturesDone, setPromptSignaturesDone] = useState(false);

  useEffect(() => {
    const contract = new CustodyContractService();
    const wallet = contract.getWallet();
    setWallet(wallet);
    setCustodyContract(contract);
  }, []);

  useEffect(() => {
    if (custodyContract) {
      createShards();
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
    const vault = custodyContract.getVault();
    console.log("App.js promptSignatures", vault);

    vault.NewTransaction((res) => {
      console.log("App.js custodyContract.NewTransaction", res);
      setTxid(res.response.result[0]);
    });
  };

  const signTransaction = (participant, pin) => {
    custodyContract
      .signTransaction(participant, txid, pin)
      .then((res) => {
        console.log("App.js custodyContract.signTransaction", res);
      })
      .catch((error) => {
        console.log("App.js custodyContract.signTransaction error", error);
      });
  };

  const checkQuorum = () => {
    custodyContract
      .checkQuorum(participantEmail, txid)
      .then((res) => {
        console.log("App.js custodyContract.checkQuorum", res);
      })
      .catch((error) => {
        console.log("App.js custodyContract.checkQuorum error", error);
      });
  };

  const getShards = () => {
    custodyContract
      .getShards(txid)
      .then((res) => {
        console.log("App.js custodyContract.getShards", res);
      })
      .catch((error) => {
        console.log("App.js custodyContract.getShards error", error);
      });
  };

  return (
    <Container className="p-4 col-12">
      <div>
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
            <h4>Creator</h4>
          </div>
          <div style={{ flex: "1" }} className="d-flex justify-content-center">
            <h4>Participant</h4>
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
            <AddParticipant
              custodyContract={custodyContract}
              participantAdded={participantAdded}
              setParticipantAdded={setParticipantAdded}
              participant={participant}
              setParticipant={setParticipant}
              disabled={!quorumDefined}
            />
            <ParticipantConfirm1
              custodyContract={custodyContract}
              participant1Confirmed={participant1Confirmed}
              setParticipant1Confirmed={setParticipant1Confirmed}
              shares={shares}
              disabled={!participantAdded}
            />

            <PromptSignatures
              custodyContract={custodyContract}
              promptSignaturesDone={promptSignaturesDone}
              setPromptSignaturesDone={setPromptSignaturesDone}
              shares={shares}
              disabled={!participant2Confirmed}
              promptSignatures={promptSignatures}
            />
          </div>
          <div style={{ flex: "1" }} className="">
            <div className="my-2">
              <div>txid: {txid}</div>
            </div>
            <ParticipantConfirm2
              custodyContract={custodyContract}
              participant2Confirmed={participant2Confirmed}
              setParticipant2Confirmed={setParticipant2Confirmed}
              shares={shares}
              disabled={!participant1Confirmed}
            />
            <div className="my-2">
              <Button
                disabled={!txid}
                onClick={() =>
                  signTransaction(participantEmail, participantPin)
                }
              >
                Sign Transaction Participant 2
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-2">
        <Button disabled={!txid} onClick={() => signTransaction("", "")}>
          Sign Transaction Participant 1
        </Button>
      </div>

      <div className="my-2">
        <Button disabled={!txid} onClick={checkQuorum}>
          Check Quorum
        </Button>
      </div>
      <div className="my-2">
        <Button onClick={getShards}>Get Shards</Button>
      </div>
    </Container>
  );
}

export default App;
