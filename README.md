# Token Whitelisting & Blacklisting

## Introduction

This project aims to create and deploy a token contract where the issuer has complete ownership. The contract allows for whitelisting and blacklisting of wallets, with certain restrictions on token transfers based on the whitelist/blacklist status. Initially, all wallets are whitelisted, but the owner can blacklist wallets, affecting their interactions and those of their peers.

## Smart Contract Details

- **Contract Location**: The smart contract can be found in the `contracts/` directory.
- **ERC20 Token**: The contract utilizes ERC20 token standards to manage transfers and balances.
- **Deployment**: The contract has been deployed on the Polygon Amoy Testnet. You can find the contract address [here](https://www.oklink.com/amoy/token/0xbE05139CaCEDcE51AD461E19b852aFb42ac5F9aa).
- **State Variables**:
  - `isBlacklisted`: Mapping to track if an account is blacklisted or not.
  - `noOfAddress`: Array to track the number of accounts interacting with the token.
  - `hasInteractedWith`: Nested mapping to track which account has interacted with another account.
- **Functions**:
  - Constructor: Contains details about ERC20 token deployment, including name, symbol, and initial supply.
  - Basic ERC20 Functions: Functions like `transfer`, `balanceOf`, `mint`, `approve`, etc.
  - Overrides: Some functions are overridden to add more security checks for blacklisted addresses and other constraints.
  - Additional Functions: Functions like `whitelistAddress` and `blacklistAddress` to whitelist or blacklist accounts and their interacting accounts. Function `isBlacklistedAddress` checks the blacklist/whitelist status of an account.
  - Adding Additional Accounts: Functionality to add additional accounts when needed.

## Development Environment

- **Environment**: Hardhat is used as the development environment, which assists in compiling, testing, and deploying smart contracts. It also provides a local blockchain for interaction and testing.
- **Commands**:
  - `npx hardhat compile`: Compiles the smart contracts.
  - `npx hardhat ignition deploy ./ignition/modules/Whitelist.sol`: Deploys the smart contract. Amoy testnet is used as the default network for deployment.

## Getting Started

1. Create a `.env` file based on the `.env.example` file with appropriate values.
2. Run `yarn install` or `npm install` to download all dependencies to your local machine.

## Script

A script is provided to visualize the proper functioning of the smart contract. It performs actions like minting tokens, transferring tokens between whitelisted accounts, blacklisting an account, checking the status of another account, and converting back to whitelisted.

To run the script, navigate to the `scripts/` folder in the terminal and execute `node script.js`.
