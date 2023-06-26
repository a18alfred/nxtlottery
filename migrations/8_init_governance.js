const randomness = artifacts.require('Randomness');
const governance = artifacts.require('Governance');
const lottery645 = artifacts.require('Lottery645');
const lottery749 = artifacts.require('Lottery749');
const lottery420 = artifacts.require('Lottery420');
const tickets = artifacts.require('Tickets');


module.exports = async function(deployer, network, accounts) {
	const governanceContract = await governance.deployed();
	const randomnessContract = await randomness.deployed();
	const ticketsContract = await tickets.deployed();
	const lotteryFee = 4000; // 40%

	await governanceContract.init(
		randomnessContract.address,
		ticketsContract.address,
		lotteryFee
	);

	// For testing **********************************************
	// const lottery645contract = await lottery645.deployed();
	// const lottery749contract = await lottery749.deployed();
	// const lottery420contract = await lottery420.deployed();
	//
	// await governanceContract.addLottery(
	// 	lottery645contract.address,
	// 	web3.utils.toWei('0.001', 'Ether'),
	// 	'3600',
	// 	web3.utils.toWei('1', 'Ether'),
	// 	'1700291813'
	// );
	//
	// await governanceContract.addLottery(
	// 	lottery749contract.address,
	// 	web3.utils.toWei('0.001', 'Ether'),
	// 	'3600',
	// 	web3.utils.toWei('1', 'Ether'),
	// 	'1700291813'
	// );
	//
	// await governanceContract.addLottery(
	// 	lottery420contract.address,
	// 	web3.utils.toWei('0.001', 'Ether'),
	// 	'3600',
	// 	web3.utils.toWei('1', 'Ether'),
	// 	'1700291813'
	// );
	// *********************************************************
};
