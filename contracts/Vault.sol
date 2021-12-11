// Implementation of the Verified custody vault
// Manages accounts, participants and vault policies
// (c) Kallol Borah, Verified Network, 2021

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

import "./IVault.sol";

contract Vault is IVault {

    //mapping vault address (public key) to participants in the vault
    mapping(address => address[]) private vaults;

    //mapping vault address to participants to their key shard
    mapping(address => mapping(address => bytes32)) private shards;

    //mapping vault address to number of minimum co-signers required for quorum
    mapping(address => uint256) private quorum;

    //mapping vault address to transactions
    mapping(address => transaction[]) private transactions;

    function createVault(address _vault) external {
        require(vaults[_vault].length==0);
        vaults[_vault].push(msg.sender);
    }

    function addParticipant(address _vault, address _participant) external {
        require(vaults[_vault].length>0);
        require(vaults[_vault][0]==msg.sender);
        vaults[_vault].push(_participant);
    }

    function removeParticipant(address _vault, address _participant) external {
        require(vaults[_vault].length>0);
        require(vaults[_vault][0]==msg.sender);
        for(uint256 i=0; i<vaults[_vault].length; i++){
            if(vaults[_vault][i]==_participant)
                delete vaults[_vault][i];
        }
    } 

    function confirmParticipant(address _vault, bytes32 _shard) external {
        require(vaults[_vault].length>0);
        for(uint256 i=0; i<vaults[_vault].length; i++){
            if(vaults[_vault][i]==msg.sender)
                shards[_vault][msg.sender] = _shard;
        }
    }

    function defineQuorum(address _vault, uint256 _minParticipants) external {
        require(vaults[_vault].length>0);
        require(vaults[_vault][0]==msg.sender);
        quorum[_vault] = _minParticipants;
    }

    function signTransaction(address _vault, bytes32 _txHash, address _from, address _to, uint256 _amount) external {
        require(shards[_vault][msg.sender]!="");
        bool found = false;
        for(uint i=0; i<transactions[_vault].length; i++){
            if(transactions[_vault][i].transaction==_txHash){
                transactions[_vault][i].cosigners.push(msg.sender);
                found = true;
            }
        }
        if(!found){
            address[] memory cs;
            cs[0] = msg.sender;
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

    function checkQuorum(address _vault, bytes32 _txHash) external view returns(bool){
        require(shards[_vault][msg.sender]!="");
        bool found = false;
        for(uint i=0; i<transactions[_vault].length; i++){
            if(transactions[_vault][i].transaction==_txHash){
                if(transactions[_vault][i].cosigners.length == quorum[_vault])
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

    function getShard(address _vault) external view returns(bytes32){
        return shards[_vault][msg.sender];
    }

}