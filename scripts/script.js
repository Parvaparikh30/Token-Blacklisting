const ethers = require("ethers");
require("dotenv").config({ path: "../.env" });
const abi = require("../scripts/abi/Whitelist.json")
const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY_OWNER = process.env.PRIVATE_KEY_OWNER
const PRIVATE_KEY_TEST_ACCOUNT = process.env.PRIVATE_KEY_TEST_ACCOUNT
const provider = new ethers.JsonRpcProvider(RPC_URL);
const walletOwner = new ethers.Wallet(PRIVATE_KEY_OWNER, provider);
const walletTestAccount = new ethers.Wallet(PRIVATE_KEY_TEST_ACCOUNT, provider);
const whitelistAddress = require("../ignition/deployments/chain-80002/deployed_addresses.json")["WhitelistModule#Whitelist"]
const whitelistContractOwner = new ethers.Contract(whitelistAddress, abi, walletOwner);
const whitelistContractTestAccount = new ethers.Contract(whitelistAddress, abi, walletTestAccount);
const testAccount1 = process.env.PUBLIC_ADDRESS_TEST_ACCOUNT
const testAccount2 = process.env.PUBLIC_ADDRESS_TEST_ACCOUNT_2

async function main() {

    console.log("----------------- START -----------------")
    // Checking if the accounts are blacklisted or not
    console.log(`Checking ${testAccount1} & ${testAccount2} are Blacklisted or not`)
    const isBlacklistedTest1 = await whitelistContractOwner.isBlacklistedAddress(testAccount1)
    const isBlacklistedTest2 = await whitelistContractOwner.isBlacklistedAddress(testAccount2)

    if (!isBlacklistedTest1) {
        console.log(`${testAccount1} is Whitelisted`)
    }
    else {
        console.log(`${testAccount1} is Blacklisted`)
    }
    if (!isBlacklistedTest2) {
        console.log(`${testAccount2} is Whitelisted`)
    }
    else {
        console.log(`${testAccount2} is Blacklisted`)
    }

    console.log("----------------------------------")
    console.log("Interacting the test account with another account by transferring 25 tokens from testAccount to another account to check if 1 of the test account gets blacklisted then all the interacting accounts also gets blacklisted")
    console.log("----------------------------------")

    // Minting 100 tokens to testAccount1
    const mintAmount = 100 * 10 ** 18 // 100 ETH in Wei
    console.log("Minting 100 tokens to testAccount1 by Owner")
    try {
        const mintTokensToTestAccount1 = await whitelistContractOwner.mint(testAccount1, mintAmount.toString())
        await mintTokensToTestAccount1.wait()
    }
    catch (e) {
        console.log(`Error while minting tokens to testAccount1 ${testAccount1}`, e)
    }

    console.log(`Minted tokens to testAccount1 `)

    // Transferring 25 tokens from testAccount1 to testAccount2
    const amountToTransfer = 25 * 10 ** 18; // 25 ETH in Wei
    const transferTokenFromTest1ToTest2 = await whitelistContractTestAccount.transfer(testAccount2, amountToTransfer.toString())
    await transferTokenFromTest1ToTest2.wait()
    console.log(`Transferred ${amountToTransfer}wei tokens from ${testAccount1} to ${testAccount2}`)
    console.log("----------------------------------")

    // Blackisting testAccount1
    console.log("Now converting the testAccount1 to Blacklisted")
    try {
        const blacklistTestAccount1 = await whitelistContractOwner.blacklistAddress(testAccount1)
        await blacklistTestAccount1.wait()
    }
    catch (e) {
        console.log("Error while Blacklisting testAccount1 ", e)
    }

    console.log(`Blacklisted TestAccount1${testAccount1}`)
    // Checking if the interacting account is also blacklisted or not
    console.log(`Checking  TestAccount2 - ${testAccount2} is Blacklisted or not as it was interacting with testAccount1`)
    const isBlacklistedTest2AfterBlacklistTest1 = await whitelistContractOwner.isBlacklistedAddress(testAccount2)
    if (isBlacklistedTest2AfterBlacklistTest1) {
        console.log(`TestAccount2 - ${testAccount2} is Blacklisted`)
        console.log("The interacting account is also Blacklisted ")
    }
    else {
        console.log(`TestAccount 2 - ${testAccount2} is Whitelisted`)
    }
    console.log("----------------------------------")

    // Trying to transfer tokens from Blacklisted testAccount1 to testAccount2
    console.log("Trying to transfer tokens from Blacklisted testAccount1 to testAccount2")
    try {
        const transferTokenFromTest1ToTest2AfterBlacklist = await whitelistContractTestAccount.transfer(testAccount2, amountToTransfer.toString())
        await transferTokenFromTest1ToTest2AfterBlacklist.wait()
    }
    catch (e) {
        console.log("Error while transferring tokens from Blacklisted testAccount1 to testAccount2. Error Reason- ", e.reason)
    }
    console.log("Transfer failed as the sender(TestAccount1) was Blacklisted")
    console.log("----------------------------------")

    // Whitelisting testAccount1
    console.log(`Now converting the testAccount1 ${testAccount1} back to Whitelisted`)
    try {
        const whitelistTestAccount1 = await whitelistContractOwner.whitelistAddress(testAccount1)
        await whitelistTestAccount1.wait()
    }
    catch (e) {
        console.log("Error while Whitelisting testAccount1 ", e)
    }

    console.log(`Whitelisted TestAccount1 - ${testAccount1}`)
    // Checking if the interacting account got whitelisted or not
    console.log(`Checking  TestAccount2 - ${testAccount2} is Blacklisted or not as it was interacting with testAccount1`)
    const isBlacklistedTest2AfterWhitelistTest1 = await whitelistContractOwner.isBlacklistedAddress(testAccount2)
    if (isBlacklistedTest2AfterWhitelistTest1) {
        console.log(`TestAccount2 ${testAccount2} is Blacklisted`)
    }
    else {
        console.log(`TestAccount2 ${testAccount2} also got Whitelisted`)
    }
    console.log("-------------- END --------------")


}

main()