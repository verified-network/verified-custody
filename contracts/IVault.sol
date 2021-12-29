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
        uint256[] cosigners;
        address from;
        address to;
    }

    function createVault(uint256 _creator) external;

    function addParticipant(uint256 _creator, uint256 _participant) external;

    function removeParticipant(address _vault, uint256 _creator, uint256 _participant) external;

    function confirmParticipant(address _vault, uint256 _participant, bytes32 _shard, bytes32 _pin) external;

    function defineQuorum(address _vault, uint256 _creator, uint256 _minParticipants) external;

    function signTransaction(address _vault, uint256 _participant, bytes32 _txHash, address _from, address _to, uint256 _amount) external;

    function checkQuorum(address _vault, bytes32 _txHash) external view returns(bool);

    function getTransactions(address _vault) external view returns(transaction[] memory);

    function getShard(address _vault, uint256 _participant) external view returns(bytes32);

}