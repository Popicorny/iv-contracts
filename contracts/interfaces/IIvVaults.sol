// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;

interface IIvV2Vault {
    function depositFor(uint256 amount, address creditor) external;
}

interface IIvV1Vault {
    function deposit(uint256 amount) external;
}
