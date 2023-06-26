const governance = artifacts.require('Governance');
const lottery420 = artifacts.require('Lottery420');

module.exports = async function(deployer, network, accounts) {
	const governanceContract = await governance.deployed();
	await deployer.deploy(lottery420, governanceContract.address);
	//await deployer.deploy(lottery420, governanceContract.address, { from: accounts[0], value: '10000000000000000000' });
};
