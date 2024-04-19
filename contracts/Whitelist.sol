// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is ERC20, Ownable {
    // state Variables
    // Mapping to keep track of blacklisted addresses
    mapping(address => bool) public isBlacklisted;
    // Array to keep track of all addresses
    address[] private addressArray;
    // Mapping to keep track of direct interactions
    mapping(address => mapping(address => bool)) public hasInteractedWith;

    // Events Declaration
    event BlacklistAddress(address);
    event WhitelistAddress(address);

    // Constructor which accepts Token name,symbol, initital Supply and a list of addresses to whitelist
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address[] memory initialWhitelistAddress
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        for (uint256 i = 0; i < initialWhitelistAddress.length; i++) {
            isBlacklisted[initialWhitelistAddress[i]] = false;
            addressArray.push(initialWhitelistAddress[i]);
            emit WhitelistAddress(initialWhitelistAddress[i]);
        }
    }

    // Function to blacklist an address and its interacted addresses
    function blacklistAddress(address _toBlacklist) external onlyOwner {
        require(_toBlacklist != owner(), "Cannot blacklist owner");
        require(!isBlacklisted[_toBlacklist], "Already Blacklisted");
        isBlacklisted[_toBlacklist] = true;
        emit BlacklistAddress(_toBlacklist);
        // emit event
        for (uint256 i = 0; i < addressArray.length; i++) {
            // Iterate through all possible addresses for simplicity
            if (hasInteractedWith[_toBlacklist][addressArray[i]]) {
                isBlacklisted[addressArray[i]] = true;
                emit BlacklistAddress(addressArray[i]);
            }
        }
    }

    // Function to whitelist an address and its interacted addresses
    function whitelistAddress(address _toWhitelist) external onlyOwner {
        require(isBlacklisted[_toWhitelist], "Already Whitelisted");
        isBlacklisted[_toWhitelist] = false;
        emit WhitelistAddress(_toWhitelist);
        for (uint256 i = 0; i < addressArray.length; i++) {
            // Iterate through all possible addresses for simplicity
            if (hasInteractedWith[_toWhitelist][addressArray[i]]) {
                isBlacklisted[addressArray[i]] = false;
                emit WhitelistAddress(addressArray[i]);
                // emit event
            }
        }
    }

    // To check if an address is blacklisted or not
    function isBlacklistedAddress(address _address) public view returns (bool) {
        return isBlacklisted[_address];
    }

    // Transfer tokens from the sender to the recipient using the allowance mechanism
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(!isBlacklisted[sender], "Sender is blacklisted");
        require(!isBlacklisted[recipient], "Recipient is blacklisted");
        recordInteraction(sender, recipient);
        address spender = _msgSender();
        super._spendAllowance(sender, spender, amount);
        super._transfer(sender, recipient, amount);
        recordInteraction(sender, recipient);
        return true;
    }

    // Transfer tokens from the sender to the recipient
    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(!isBlacklisted[msg.sender], "Sender is blacklisted");
        require(!isBlacklisted[recipient], "Recipient is blacklisted");
        super._transfer(msg.sender, recipient, amount);
        recordInteraction(msg.sender, recipient);
        return true;
    }

    // Records the interaction between two addresses to keep of blackistlisting the interacted Account
    function recordInteraction(address _sender, address _receiver) internal {
        hasInteractedWith[_sender][_receiver] = true;
        hasInteractedWith[_receiver][_sender] = true;
    }

    // Mint new tokens by owner
    function mint(address _to, uint256 _amount) external onlyOwner {
        require(!isBlacklisted[_to], "Recipient is blacklisted");
        _mint(_to, _amount);
    }

    // Add multiple accounts to the whitelist at once.
    function addAccounts(address[] memory _addressArray) external onlyOwner {
        uint256 length = _addressArray.length;
        for (uint256 i = 0; i < length; i++) {
            isBlacklisted[_addressArray[i]] = false;
            addressArray.push(_addressArray[i]);
            emit WhitelistAddress(_addressArray[i]);
        }
    }

    // Function to approve an address to spend tokens on behalf of the owner
    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        require(!isBlacklisted[msg.sender], "Sender is blacklisted");
        require(!isBlacklisted[spender], "Recipient is blacklisted");
        super._approve(msg.sender, spender, amount);
        return true;
    }
}
