// Implementation of the Verified custody vault
// Manages accounts, participants and vault policies
// (c) Kallol Borah, Verified Network, 2021

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

import "./IVault.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";

contract Vault is IVault, Ownable {

    //mapping signer (its bytes32 ID, eg creator@vault.com) to its token (eg, Google/Apple push notification token)
    mapping(bytes32 => bytes32) private creators;

    //creating vault by mapping its creator (bytes32 ID, eg, creator@vault.com) to participants (bytes32 IDs, eg, participant@email.com) in the vault
    mapping(bytes32 => bytes32[]) private vaults;

    //mapping vault (bytes32 ID, eg creator@vault.com) to participants (bytes32 ID, eg, participant@email.com) to their pin (uint256)
    mapping(bytes32 => mapping(bytes32 => uint256)) private pins;

    //mapping vault (bytes32 ID, eg creator@vault.com) to participants (bytes32 ID, eg, participant@email.com) to their key shard (string)
    mapping(bytes32 => mapping(bytes32 => string)) private shards;

    //mapping vault (bytes32 ID, eg creator@vault.com) to number of minimum co-signers required for quorum (uint256)
    mapping(bytes32 => uint256) private quorum;

    //mapping vault (bytes32 ID, eg creator@vault.com) to transactions
    mapping(bytes32 => transaction[]) private transactions;

    //event that helps notify a participant to confirm PIN and shard
    event NewParticipant(bytes32 creator, bytes32 participant);

    //event that helps notify a participant to co-sign a transaction
    event NewTransaction(bytes32 creator, bytes32 participant, uint256 txid);

    //event that helps notify a creator that a transaction has been signed
    event SignTransaction(bytes32 creator, bytes32 participant, uint256 txid);

    /**
        This function creates a vault for the creator
        @param _creator vault creator's username, eg, creator@email.com
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
     */
    function createVault(bytes32 _creator, bytes32 _id) external {
        require(vaults[_creator].length==0);
        creators[_creator]=_id;
        vaults[_creator].push(_creator);
    }

    /**
        This function returns the vault creator's unique ID (eg, Google/APNS messaging token)
        @param _creator the vault creator (eg, creator@email.com)
        @return the vault creator's unique ID
     */
    function getCreator(bytes32 _creator) external returns(bytes32){
        require(msg.sender == owner());
        return creators[_creator];        
    }

    /**
        This function adds a participant to a vault that belongs to its creator
        @param _creator vault creator's username, eg creator@email.com
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
        @param _participant vault participant's username, eg participant@email.com
     */
    function addParticipant(bytes32 _creator, bytes32 _id, bytes32 _participant) external {
        require(vaults[_creator].length>0);
        require(vaults[_participant].length>0);
        require(creators[_creator]==_id);
        require(vaults[_creator][0]==_creator);
        vaults[_creator].push(_participant);
        emit NewParticipant(_creator, creators[_participant]);
    }

    /**
        This function removes a participant in a vault that belongs to its creator
        @param _creator vault creator's username, eg creator@email.com
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
        @param _participant vault participant's username, eg participant@email.com
     */
    function removeParticipant(bytes32 _creator, bytes32 _id, bytes32 _participant) external {
        require(vaults[_creator].length>0);
        require(vaults[_creator][0]==_creator);
        require(creators[_creator]==_id);
        for(uint256 i=0; i<vaults[_creator].length; i++){
            if(vaults[_creator][i]==_participant){
                delete vaults[_creator][i];
                delete shards[_creator][_participant];
                delete pins[_creator][_participant];
            }
        }
    } 

    /**
        This function confirms a participant in the vault when the participant sends its private key shard and PIN
        @param _creator the vault's creator (eg, creator@email.com)
        @param _participant the vault's participant (eg, participant@email.com)
        @param _id vault participant's unique id using which it can be reached, eg, its Google/APNS token
        @param _shard the private key shard of the participant
        @param _pin the PIN number of the participant
     */
    function confirmParticipant(bytes32 _creator, bytes32 _participant, bytes32 _id, string calldata _shard, uint256 _pin) external {
        require(vaults[_creator].length>0);
        require(creators[_participant]==_id);
        for(uint256 i=0; i<vaults[_creator].length; i++){
            if(vaults[_creator][i]==_participant){
                shards[_creator][_participant] = _shard;
                pins[_creator][_participant] = _pin;
            }
        }
    }

    /**
        This function defines the number of participants required to co-sign a transaction
        @param _creator the vault's creator (eg, creator@email.com)
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
        @param _minParticipants the minimum number of co-signers
     */
    function defineQuorum(bytes32 _creator, bytes32 _id, uint256 _minParticipants) external {
        require(vaults[_creator].length>0);
        require(vaults[_creator][0]==_creator);
        require(creators[_creator]==_id);
        quorum[_creator] = _minParticipants;
    }

    /**
        This function prompts participants to co-sign a transaction on the vault (ie, the creator's address secured by the quorum of participants)
        @param _creator the vault's creator (eg, creator@email.com)
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
     */
    function promptSignatures(bytes32 _creator, bytes32 _id) external {
        require(creators[_creator]==_id);
        bytes32[] memory cs;
        cs[0] = _creator;
        uint256 txid = now;
        transaction memory currentTx = transaction({
            datetime : txid,
            cosigners : cs
        });
        transactions[_creator].push(currentTx);
        for(uint256 i=0; i<vaults[_creator].length; i++){
            emit NewTransaction(_creator, creators[vaults[_creator][i]], txid);
        }
    }

    /**
        This function lets a participant co-sign a transaction
        @param _creator the vault's creator (eg, creator@email.com)
        @param _participant the vault's participant (eg, participant@email.com)
        @param _id vault participant's unique id using which it can be reached, eg, its Google/APNS token
        @param _tx transaction identifier
        @param _pin the PIN number of the signer (participant)
     */
    function signTransaction(bytes32 _creator, bytes32 _participant, bytes32 _id, uint256 _tx, uint256 _pin) external {
        require(pins[_creator][_participant]==_pin);
        require(creators[_participant]==_id);
        for(uint i=0; i<transactions[_creator].length; i++){
            if(transactions[_creator][i].datetime==_tx){
                transactions[_creator][i].cosigners.push(_participant);
            }
        }
        emit SignTransaction(creators[_creator], _participant, _tx);
    }

    /**
        This function lets the creator check if quorum has been achieved for a particular transaction
        @param _creator vault creator's username, eg creator@email.com
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
        @param _participant vault participant's username, eg participant@email.com
        @param _txid transaction identifier
     */
    function checkQuorum(bytes32 _creator, bytes32 _id, bytes32 _participant, uint256 _txid) external view returns(bool){
        require(pins[_creator][_participant]!=0);
        require(creators[_creator]==_id);
        bool _quorum = false;
        for(uint i=0; i<transactions[_creator].length; i++){
            if(transactions[_creator][i].datetime==_txid){
                if(transactions[_creator][i].cosigners.length >= quorum[_creator])
                    _quorum = true;
            }
        }
        if(_quorum)
            return true;
        else
            return false;
    }
    
    /**
        This function gets the shard for a participant
        @param _creator vault creator's username, eg creator@email.com
        @param _id vault creator's unique id using which it can be reached, eg, its Google/APNS token
        @param _txid transaction identifier 
     */
    function getShards(bytes32 _creator, bytes32 _id, uint256 _txid) external view returns(string[] memory){
        require(creators[_creator]==_id);
        for(uint i=0; i<transactions[_creator].length; i++){
            if(transactions[_creator][i].datetime==_txid){
                if(transactions[_creator][i].cosigners.length >= quorum[_creator]){
                    string[] memory keyShards = new string[](transactions[_creator][i].cosigners.length);
                    for(uint j=0; j<transactions[_creator][i].cosigners.length; j++){
                        keyShards[j] = shards[_creator][transactions[_creator][i].cosigners[j]];
                    }
                    return keyShards;
                }
            }
        }
    }

}