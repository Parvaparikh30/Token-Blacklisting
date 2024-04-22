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
  - Constructor: Contains details about ERC20 token deployment, including name, symbol, and initial supply and a list of whitelisted addresses.
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

<img width="1054" alt="Screenshot 2024-04-22 at 12 44 42 PM" src="https://github.com/Parvaparikh30/BlacklistAddresses/assets/58827015/437a7a62-603f-4b86-af04-f15095f0bf20">

# Scaling the DApp

As the number of accounts interacting with our contract increases, the cost of updating and retrieving data/state variables will increase dramatically. With each account added, we need to iterate through arrays and mappings to check if the account is blacklisted or not. Additionally, the `hasInteracted` mapping will become more complex as user interactions increase. This can result in significant gas costs, with updating a blacklisted account potentially costing more than 3,500,000 gas with an array size of about 1000 accounts.

## Solution

### Oracles

Oracles play a crucial role in bringing off-chain data to on-chain applications. Chainlink, a decentralized oracle network, is widely used in DeFi projects to fetch off-chain prices of tokens and other assets. Chainlink offers Chainlink Functions, which facilitate data retrieval from APIs and perform custom computations.

#### How Oracles Work

1. **Request Handling**: When a request is made to a smart contract, it is sent to a Decentralized Oracle Network (DON). A node in the DON executes the code in a serverless environment.
2. **Data Aggregation**: The DON aggregates all independent return values from each execution.
3. **Result Return**: The final result is sent back to the smart contract.

<img width="906" alt="Screenshot 2024-04-22 at 3 06 43 PM" src="https://github.com/Parvaparikh30/BlacklistAddresses/assets/58827015/f079c5d1-e6be-4b30-8821-285dc22e22fb">



### Integration with Smart Contracts

To integrate oracles with smart contracts, we need to add Chainlink Libraries such as `FunctionClient` and `FunctionRequest`. These libraries facilitate the sending and receiving of data between the blockchain and off-chain sources.

#### sendRequest Function in Solidity
<img width="500" alt="Screenshot 2024-04-22 at 2 45 47 PM" src="https://github.com/Parvaparikh30/BlacklistAddresses/assets/58827015/0c824686-a0e2-4028-ac02-463cdaf1b751">


#### fulfillRequest Function in Solidity
<img width="581" alt="Screenshot 2024-04-22 at 2 46 00 PM" src="https://github.com/Parvaparikh30/BlacklistAddresses/assets/58827015/1c92b383-a5aa-4a5b-a46a-d04a6658e591">


#### Example Use Cases:

1. **Checking Blacklisted Status**: We can use `sendRequest` to GET request an API, facilitating a request to check if an account is blacklisted or not.
2. **Blacklisting Accounts**: To blacklist an address and its interacting addresses, we can use `sendRequest` to POST request an API to an oracle. The request is then sent to a backend system, typically written in JavaScript. The backend system can store address details in a centralized or decentralized database, such as MongoDB or ComposeDB. These databases maintain the blacklist and interacting account details, which are updated based on the API request. This off-chain processing drastically reduces the cost of such transactions.


By leveraging oracles, we can efficiently handle large-scale interactions with our smart contracts while minimizing gas costs and improving scalability.
