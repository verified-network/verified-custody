// Implementation of the Verified custody vault
// Manages accounts, participants and vault policies
// (c) Kallol Borah, Verified Network, 2021

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

import "./IVault.sol";

contract Vault is IVault {

    //mapping vault (bytes32 ID) to participants (bytes32 IDs) in the vault
    mapping(bytes32 => bytes32[]) private vaults;

    //mapping vault (bytes32 ID) to participants (bytes32 ID) to their pin (uint256)
    mapping(bytes32 => mapping(bytes32 => uint256)) private pins;

    //mapping vault (bytes32 ID) to participants (bytes32 ID) to their key shard (string)
    mapping(bytes32 => mapping(bytes32 => string)) private shards;

    //mapping vault (bytes32 ID) to number of minimum co-signers required for quorum (uint256)
    mapping(bytes32 => uint256) private quorum;

    //mapping vault (bytes32 ID) to transactions
    mapping(bytes32 => transaction[]) private transactions;

    //event that helps notify a participant to confirm PIN and shard
    event promptNewParticipant(bytes32 vault, bytes32 participant);

    function createVault(bytes32 _creator) external {
        require(vaults[_creator].length==0);
        vaults[_creator].push(_creator);
    }

    function addParticipant(bytes32 _creator, bytes32 _participant) external {
        require(vaults[_creator].length>0);
        require(vaults[_creator][0]==_creator);
        vaults[_creator].push(_participant);
        emit promptNewParticipant(_creator, _participant);
    }

    function removeParticipant(bytes32 _creator, bytes32 _participant) external {
        require(vaults[_creator].length>0);
        require(vaults[_creator][0]==_creator);
        for(uint256 i=0; i<vaults[_creator].length; i++){
            if(vaults[_creator][i]==_participant){
                delete vaults[_creator][i];
                delete shards[_creator][_participant];
                delete pins[_creator][_participant];
            }
        }
    } 

    function confirmParticipant(bytes32 _vault, bytes32 _participant, string calldata _shard, uint256 _pin) external {
        require(vaults[_vault].length>0);
        for(uint256 i=0; i<vaults[_vault].length; i++){
            if(vaults[_vault][i]==_participant){
                shards[_vault][_participant] = _shard;
                pins[_vault][_participant] = _pin;
            }
        }
    }

    function defineQuorum(bytes32 _vault, uint256 _minParticipants) external {
        require(vaults[_vault].length>0);
        require(vaults[_vault][0]==_vault);
        quorum[_vault] = _minParticipants;
    }

    function signTransaction(bytes32 _vault, bytes32 _participant, bytes32 _txHash, address _from, address _to, uint256 _amount) external {
        //require(shards[_vault][_participant]!="");
        bool found = false;
        for(uint i=0; i<transactions[_vault].length; i++){
            if(transactions[_vault][i].transaction==_txHash){
                transactions[_vault][i].cosigners.push(_participant);
                found = true;
            }
        }
        if(!found){
            bytes32[] memory cs;
            cs[0] = _participant;
            transaction memory currentTx = transaction({
                transaction : _txHash,
                datetime : now,
                amount : _amount,
                cosigners : cs,
                from : _from,
                to : _to
            });
            transactions[_vault].push(currentTx);
        }
    }

    function checkQuorum(bytes32 _vault, bytes32 _participant, bytes32 _txHash) external view returns(bool){
        //require(shards[_vault][_participant]!="");
        bool found = false;
        for(uint i=0; i<transactions[_vault].length; i++){
            if(transactions[_vault][i].transaction==_txHash){
                if(transactions[_vault][i].cosigners.length >= quorum[_vault])
                    found = true;
            }
        }
        if(found)
            return true;
        else
            return false;
    }

    function getTransactions(bytes32 _vault) external view returns(transaction[] memory){
        return transactions[_vault];
    }

    function getShard(bytes32 _vault, bytes32 _participant) external view returns(string memory){
        return shards[_vault][_participant];
    }

}