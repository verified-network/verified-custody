// Kallol Borah, 2021
// Test cases for Verified Custody

const secrets = require("secrets.js-grempe");
const ethers = require("ethers");
const Vault = artifacts.require('Vault');

contract("Vault contract testing", async (accounts) => {

    it("Create random wallet using etherjs and split key to store shards in Vault", async () => {
    
        var vault = await Vault.deployed();

        await vault.createVault(ethers.utils.formatBytes32String("abc1234"))
        .then(async()=>{
            console.log("Created a vault");
            let randomWallet = ethers.Wallet.createRandom();
            console.log("Wallet created is "+randomWallet.privateKey);
            var shares = secrets.share(randomWallet.privateKey.substring(2), 3, 2);
            console.log("Key share 1: "+shares[0]);
            console.log("Key share 2: "+shares[1]);
            console.log("Key share 3: "+shares[2]);
            await vault.defineQuorum(ethers.utils.formatBytes32String("abc1234"),'2')
            .then(async()=>{
                console.log("Defined quorum");
                await vault.addParticipant(ethers.utils.formatBytes32String("abc1234"), ethers.utils.formatBytes32String("xyz1234"))
                .then(async()=>{
                    console.log("Added participant");
                    await vault.confirmParticipant(ethers.utils.formatBytes32String("abc1234"), ethers.utils.formatBytes32String("abc1234"), shares[0], '1234')
                    .then(async()=>{
                        console.log("Set shard for participant 1");
                        await vault.confirmParticipant(ethers.utils.formatBytes32String("abc1234"), ethers.utils.formatBytes32String("xyz1234"), shares[1], '5678')
                        .then(async()=>{
                            console.log("Set shard for participant 2");
                            
                        })
                    })
                })
            })
        })

    })

})