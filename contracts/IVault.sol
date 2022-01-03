// Interface of Verified custody vault
// (c) Kallol Borah, 2021

//"SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

interface IVault {

    struct transaction{
        uint256 datetime;
        bytes32[] cosigners;
    }

    function createVault(bytes32 _creator, bytes32 _id) external;

    function getCreator(bytes32 _creator) external returns(bytes32);

    function addParticipant(bytes32 _creator, bytes32 _id, bytes32 _participant) external;

    function removeParticipant(bytes32 _creator, bytes32 _id, bytes32 _participant) external;

    function confirmParticipant(bytes32 _creator, bytes32 _participant, bytes32 _id, string calldata _shard, uint256 _pin) external;

    function defineQuorum(bytes32 _creator, bytes32 _id, uint256 _minParticipants) external;

    function promptSignatures(bytes32 _creator, bytes32 _id) external;

    function signTransaction(bytes32 _creator, bytes32 _participant, bytes32 _id, uint256 _tx, uint256 _pin) external;

    function checkQuorum(bytes32 _creator, bytes32 _id, bytes32 _participant, uint256 _txid) external view returns(bool);

    function getShards(bytes32 _creator, bytes32 _id, uint256 _txid) external returns(string[] memory);

}