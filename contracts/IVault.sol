// Interface of Verified custody vault
// (c) Kallol Borah, 2021

//"SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

interface IVault {

    struct transaction{
        uint256 datetime;
        uint256 amount;
        uint256 cosigners;
        address from;
        address to;
    }

    function createVault(address _vault) external;

    function addParticipant(address _participant) external;

    function changeParticipant(address _participant) external;

    function confirmParticipant(address _vault) external;

    function defineQuorum(uint256 _minParticipants) external;

    function signTransaction(address _vault, bytes32 _transaction, address _from, address _to, uint256 _amount) external;

    function checkQuorum(bytes32 _transaction) external view returns(bool);

    function getTransactions(address _vault) external view returns(transaction[] memory);

}