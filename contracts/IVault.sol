// Interface of Verified custody vault
// (c) Kallol Borah, 2021

//"SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

interface IVault {

    struct transaction{
        bytes32 transaction;
        uint256 datetime;
        uint256 amount;
        address[] cosigners;
        address from;
        address to;
    }

    function createVault(address _vault) external;

    function addParticipant(address _vault, address _participant) external;

    function removeParticipant(address _vault, address _participant) external;

    function confirmParticipant(address _vault, bytes32 _shard) external;

    function defineQuorum(address _vault, uint256 _minParticipants) external;

    function signTransaction(address _vault, bytes32 _txHash, address _from, address _to, uint256 _amount) external;

    function checkQuorum(address _vault, bytes32 _txHash) external view returns(bool);

    function getTransactions(address _vault) external view returns(transaction[] memory);

    function getShard(address _vault) external view returns(bytes32);

}