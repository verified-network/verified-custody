// Implementation of the Verified custody vault
// Manages accounts, participants and vault policies
// (c) Kallol Borah, Verified Network, 2021

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

import "./IVault.sol";

contract Vault is IVault {

    //mapping vault address (public key) to participants in the vault
    mapping(address => uint256[]) private vaults;

    //mapping vault address to participants to their pin
    mapping(address => mapping(uint256 => bytes32)) private pins;

    //mapping vault address to participants to their key shard
    mapping(address => mapping(uint256 => bytes32)) private shards;

    //mapping vault address to number of minimum co-signers required for quorum
    mapping(address => uint256) private quorum;

    //mapping vault address to transactions
    mapping(address => transaction[]) private transactions;

    //event that helps notify a participant to confirm PIN and shard
    event promptNewParticipant(address vault, uint256 participant);

    function createVault(uint256 _creator) external {
        require(vaults[msg.sender].length==0);
        vaults[msg.sender].push(_creator);
    }

    function addParticipant(uint256 _creator, uint256 _participant) external {
        require(vaults[msg.sender].length>0);
        require(vaults[msg.sender][0]==_creator);
        vaults[msg.sender].push(_participant);
        emit promptNewParticipant(msg.sender, _participant);
    }

    function removeParticipant(address _vault, uint256 _creator, uint256 _participant) external {
        require(vaults[_vault].length>0);
        require(vaults[_vault][0]==_creator);
        for(uint256 i=0; i<vaults[_vault].length; i++){
            if(vaults[_vault][i]==_participant)
                delete vaults[_vault][i];
                delete shards[_vault][_participant];
                delete pins[_vault][_participant];
        }
    } 

    function confirmParticipant(address _vault, uint256 _participant, bytes32 _shard, bytes32 _pin) external {
        require(vaults[_vault].length>0);
        for(uint256 i=0; i<vaults[_vault].length; i++){
            if(vaults[_vault][i]==_participant)
                shards[_vault][_participant] = _shard;
                pins[_vault][_participant] = _pin;
        }
    }

    function defineQuorum(address _vault, uint256 _creator, uint256 _minParticipants) external {
        require(vaults[_vault].length>0);
        require(vaults[_vault][0]==_creator);
        quorum[_vault] = _minParticipants;
    }

    function signTransaction(address _vault, uint256 _participant, bytes32 _txHash, address _from, address _to, uint256 _amount) external {
        require(shards[_vault][_participant]!="");
        bool found = false;
        for(uint i=0; i<transactions[_vault].length; i++){
            if(transactions[_vault][i].transaction==_txHash){
                transactions[_vault][i].cosigners.push(_participant);
                found = true;
            }
        }
        if(!found){
            uint256[] memory cs;
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

    function checkQuorum(address _vault, uint256 _participant, bytes32 _txHash) external view returns(bool){
        require(shards[_vault][_participant]!="");
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

    function getTransactions(address _vault) external view returns(transaction[] memory){
        return transactions[_vault];
    }

    function getShard(address _vault, uint256 _participant) external view returns(bytes32){
        return shards[_vault][_participant];
    }

}