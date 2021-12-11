// Implementation of the Verified custody vault
// Manages accounts, participants and vault policies
// (c) Kallol Borah, Verified Network, 2021

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

import "./IVault.sol";

contract Vault is IVault {

    //mapping vault address (public key) to participants in the vault
    mapping(address => address[]) private vaults;

    //mapping vault address to its creator
    mapping(address => address) private creator;

    //mapping vault address to number of minimum co-signers required for quorum
    mapping(address => uint256) private quorum;

    //mapping vault address to transactions
    mapping(address => transaction[]) private transactions;

    function createVault(address _vault) external {

    }

    function addParticipant(address _participant) external {

    }

    function changeParticipant(address _participant) external {

    } 

    function confirmParticipant(address _vault) external {

    }

    function defineQuorum(uint256 _minParticipants) external {

    }

    function signTransaction(address _vault, bytes32 _transaction, address _from, address _to, uint256 _amount) external {

    }

    function checkQuorum(bytes32 _transaction) external view returns(bool){

    }

    function getTransactions(address _vault) external view returns(transaction[] memory){

    }

}