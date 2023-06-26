const governance = artifacts.require('Governance');
const lottery749 = artifacts.require('Lottery749');

module.exports = async function(deployer, network, accounts) {
	const governanceContract = await governance.deployed();
	await deployer.deploy(lottery749, governanceContract.address);
	//await deployer.deploy(lottery420, governanceContract.address, { from: accounts[0], value: '10000000000000000000' });
};
