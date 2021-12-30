// Kallol Borah, 2021
// Test cases for Verified Custody

var secrets = require("secrets.js");
const Vault = artifacts.require('Vault');

contract("Vault contract testing", async (accounts) => {

    it("Create random wallet using etherjs and split key to store shards in Vault", async () => {
    
        var vault = await Vault.deployed();

    })

})