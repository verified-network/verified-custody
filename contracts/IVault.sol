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
        bytes32[] cosigners;
        address from;
        address to;
    }

    function createVault(bytes32 _creator) external;

    function addParticipant(bytes32 _creator, bytes32 _participant) external;

    function removeParticipant(bytes32 _creator, bytes32 _participant) external;

    function confirmParticipant(bytes32 _vault, bytes32 _participant, string calldata _shard, uint256 _pin) external;

    function defineQuorum(bytes32 _vault, uint256 _minParticipants) external;

    function signTransaction(bytes32 _vault, bytes32 _participant, bytes32 _txHash, address _from, address _to, uint256 _amount) external;

    function checkQuorum(bytes32 _vault, bytes32 _participant, bytes32 _txHash) external view returns(bool);

    function getTransactions(bytes32 _vault) external view returns(transaction[] memory);

    function getShard(bytes32 _vault, bytes32 _participant) external view returns(string memory);

}