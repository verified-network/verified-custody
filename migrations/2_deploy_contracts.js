// Deployment of Verified custodial vault
// (c) Kallol Borah, 2021

const Vault = artifacts.require('Vault');

module.exports = async function (deployer) {
    deployer.deploy(Vault);
}