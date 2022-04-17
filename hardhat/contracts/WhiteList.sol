//SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract WhiteList{

    uint8 public maxWhiteListCount;
    uint8 public whiteListNumCount;
    mapping(address=>bool) whiteListedAccounts;
    constructor(uint8 _maxWhiteListCount)
    {
        maxWhiteListCount=_maxWhiteListCount;
    }

    function addAddressToWhiteList() public {
        require(whiteListedAccounts[msg.sender]==false,"Account Already WhiteListed");
        require(whiteListNumCount < maxWhiteListCount,"Max Limit Reached");
        whiteListedAccounts[msg.sender]=true;
        whiteListNumCount = whiteListNumCount + 1;
    }

}