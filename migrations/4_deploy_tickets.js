const governance = artifacts.require('Governance');
const tickets = artifacts.require('Tickets');

module.exports = async function(deployer, network, accounts) {
	const governanceContract = await governance.deployed();
	await deployer.deploy(tickets, governanceContract.address);
};
