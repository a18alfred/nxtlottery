const randomness = artifacts.require('Randomness');
const governance = artifacts.require('Governance');


module.exports = async function(deployer, network, accounts) {
	const governanceContract = await governance.deployed();
	await deployer.deploy(randomness, governanceContract.address);
};
