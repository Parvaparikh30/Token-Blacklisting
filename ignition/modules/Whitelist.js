// deploy.js

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhitelistModule", (m) => {
    const name = m.getParameter("name", "TestToken")
    const symbol = m.getParameter("symbol", "TEST")
    const initialSupply = m.getParameter("initialSupply", "120000000000000000000");
    const initialWhitelistAddresses = m.getParameter("initialWhitelistAddresses", [
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
        "0xb3E5D0Bc825c25Ea090Aab2a74Ac35fC3cDbe1f3",
        "0xE2a8228FA011D3FA574dCB9d898d81A09C96C3Bf",
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
    ]);

    const whitelistContract = m.contract("Whitelist", [
        name,
        symbol,
        initialSupply,
        initialWhitelistAddresses
    ]);
    console.log("whitelistContract", whitelistContract)
    return { whitelistContract };
});
