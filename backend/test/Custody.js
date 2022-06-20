// Kallol Borah, 2021
// Test cases for Verified Custody

const secrets = require("secrets.js-grempe");
const ethers = require("ethers");
const Vault = artifacts.require('Vault');

contract("Vault contract testing", async (accounts) => {

    const NULL_REFERENCE = '0x0000000000000000000000000000000000000000000000000000000000000000';

    var getFirstEvent = (_event) => {
        return new Promise((resolve, reject) => {
            _event.once('data', resolve).once('error', reject);
            new Promise(resolve => setTimeout(resolve, 4000)); // waits for 4 secs
        });
    }

    it("Create random wallet using etherjs and split key to store shards in Vault", async () => {
    
        var vault = await Vault.deployed();

        await vault.createVault(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("abc1234"), {from: accounts[1]})
        .then(async()=>{
            console.log("Created a vault");
            await vault.createVault(ethers.utils.formatBytes32String("participant@email.com"), ethers.utils.formatBytes32String("xyz1234"), {from: accounts[2]})
            .then(async()=>{
                console.log("Created a vault");
                let randomWallet = ethers.Wallet.createRandom();
                console.log("Wallet created is "+randomWallet.privateKey);
                var shares = secrets.share(randomWallet.privateKey.substring(2), 3, 2);
                console.log("Key share 1: "+shares[0]);
                console.log("Key share 2: "+shares[1]);
                console.log("Key share 3: "+shares[2]);
                await vault.defineQuorum(ethers.utils.formatBytes32String("creator@email.com"), '2', {from: accounts[1]})
                .then(async()=>{
                    console.log("Defined quorum");
                    await vault.addParticipant(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("creator@email.com"), shares[0], {from: accounts[1]})
                    .then(async()=>{
                        await vault.addParticipant(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("participant@email.com"), shares[1], {from: accounts[1]})
                        .then(async()=>{
                            console.log("Added participants");
                            await vault.confirmParticipant(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("creator@email.com"), '1234', {from: accounts[1]})
                            .then(async()=>{
                                console.log("Set shard for participant 1");
                                await vault.confirmParticipant(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("participant@email.com"), '5678', {from: accounts[2]})
                                .then(async()=>{
                                    console.log("Set shard for participant 2");
                                    await vault.promptSignatures(ethers.utils.formatBytes32String("creator@email.com"), {from: accounts[1]})
                                    .then(async()=>{
                                        await getFirstEvent(vault.NewTransaction({fromBlock:1}));
                                        const rcpt = await vault.getPastEvents('NewTransaction', {fromBlock:'latest'});
                                        const txid = rcpt[0].returnValues.txid; 
                                        console.log("Prompting participants to co-sign transaction "+txid);
                                        await vault.signTransaction(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("creator@email.com"), txid, '1234', {from: accounts[1]})
                                        .then(async()=>{
                                            console.log("Transaction signed by participant 1");
                                            await vault.signTransaction(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("participant@email.com"), txid, '5678', {from: accounts[2]})
                                            .then(async()=>{
                                                console.log("Transaction signed by participant 2");
                                                await vault.checkQuorum(ethers.utils.formatBytes32String("creator@email.com"), ethers.utils.formatBytes32String("participant@email.com"), txid, {from: accounts[1]})
                                                .then(async(res)=>{
                                                    console.log("Is quorum reached ? "+res);
                                                    if(res){
                                                        await vault.getShards(ethers.utils.formatBytes32String("creator@email.com"), txid, {from: accounts[1]})
                                                        .then(async(shards)=>{
                                                            console.log("Shards received are "+shards);
                                                            var comb = secrets.combine(shards);
                                                            console.log("Private key reconstructed from shards is "+comb);
                                                            console.log("Is equal to the original key ? "+ (comb === randomWallet.privateKey.substring(2)));
                                                        })
                                                    }
                                                    await vault.getCreator(ethers.utils.formatBytes32String("creator@email.com"))
                                                    .then(async(id)=>{
                                                        console.log("Messaging token of creator is "+id);
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })

    })

})