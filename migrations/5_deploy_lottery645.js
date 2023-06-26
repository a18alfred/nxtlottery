const governance = artifacts.require('Governance');
const lottery645 = artifacts.require('Lottery645');

module.exports = async function(deployer, network, accounts) {
	const governanceContract = await governance.deployed();
	await deployer.deploy(lottery645, governanceContract.address);
	//await deployer.deploy(lottery645, governanceContract.address, { from: accounts[0], value: '10000000000000000000' });
};
