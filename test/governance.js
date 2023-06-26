const Lottery645 = artifacts.require('./Lottery645.sol');
const Governance = artifacts.require('./Governance.sol');
const Randomness = artifacts.require('./Randomness.sol');
const Tickets = artifacts.require('./Tickets.sol');

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract('Governance', ([deployer, ...accounts]) => {
	let lottery645, governance, randomness, tickets;
	let lotteryAddress;
	const correctMinPrice = web3.utils.toWei('0.001', 'Ether');
	const correctDuration = 3600;
	const correctInitialJackpot = web3.utils.toWei('1', 'Ether');
	const correctLotteryFee = 4000;
	const correctFirstDrawTime = 1700291813;

	before(async () => {
		governance = await Governance.deployed();
		randomness = await Randomness.deployed();
		lottery645 = await Lottery645.deployed();
		tickets = await Tickets.deployed();
		lotteryAddress = await lottery645.address;
	});

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await governance.address;
			const lotteryIsActive = await governance.validateLottery(lotteryAddress);
			const randomnessAddressExpected = await randomness.address;
			const randomnessAddress = await governance.randomness();
			const ticketsAddressExpected = await tickets.address;
			const ticketsAddress = await governance.tickets();
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
			assert.equal(lotteryIsActive, true);
			assert.equal(randomnessAddress, randomnessAddressExpected, ' randomnessAddress is correct');
			assert.equal(ticketsAddress, ticketsAddressExpected);
		});

		it('has  a minimumPrice', async () => {
			const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
			assert.equal(minimumPrice, correctMinPrice, ' minimumPrice is correct');
		});

		it('has  an admin', async () => {
			const admin = await governance.admin();
			assert.equal(admin, deployer, ' Admin is correct');
		});

		it('has  correct duration', async () => {
			const duration = await governance.getDuration(lotteryAddress);
			assert.equal(duration, correctDuration, ' Duration is correct');
		});

		it('has correct initialJackpot', async () => {
			const initialJackpot = await governance.getInitialJackpot(lotteryAddress);
			assert.equal(initialJackpot, correctInitialJackpot, ' initialJackpot is correct');
		});

		it('has correct lotteryFee', async () => {
			const lotteryFee = await governance.lotteryFee();
			assert.equal(lotteryFee, correctLotteryFee, ' lotteryFee is correct');
		});

		it('has correct firstDrawTime', async () => {
			const firstDrawTime = await governance.getFirstDrawTime(lotteryAddress);
			assert.equal(firstDrawTime, correctFirstDrawTime, ' firstDrawTime is correct');
		});
	});

	describe('working with governance contract', async () => {
		it('changes the governance admin', async () => {
			await governance.changeAdmin(accounts[1], { from: accounts[1] }).should.be.rejected;
			await governance.changeAdmin(deployer, { from: deployer }).should.be.rejected;
			await governance.changeAdmin(0, { from: deployer }).should.be.rejected;
			await governance.changeAdmin(accounts[1], { from: deployer });
			const admin = await governance.admin();
			assert.equal(admin, accounts[1], 'The admin is changed');
			await governance.changeAdmin(deployer, { from: accounts[1] });
		});

		it('changes the minimumPrice', async () => {
			const newPrice = web3.utils.toWei('0.0001', 'Ether');
			await governance.changeMinimumPrice(lotteryAddress, newPrice, { from: accounts[1] }).should.be.rejected;
			await governance.changeMinimumPrice(lotteryAddress, 0, { from: deployer }).should.be.rejected;
			await governance.changeMinimumPrice(lotteryAddress, newPrice, { from: deployer });
			const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
			assert.equal(minimumPrice, newPrice, 'The minimumPrice is changed');
		});

		it('changes the initialJackpot', async () => {
			const newJackpot = web3.utils.toWei('2', 'Ether');
			await governance.changeInitialJackpot(lotteryAddress, newJackpot, { from: accounts[1] }).should.be.rejected;
			await governance.changeInitialJackpot(lotteryAddress, 0, { from: deployer }).should.be.rejected;
			await governance.changeInitialJackpot(lotteryAddress, newJackpot, { from: deployer });
			const jackpot = await governance.getInitialJackpot(lotteryAddress);
			assert.equal(jackpot, newJackpot, 'The initialJackpot is changed');
			await governance.changeInitialJackpot(lotteryAddress, web3.utils.toWei('1', 'Ether'), { from: deployer });
		});

		it('changes the duration', async () => {
			const newDuration = 5000;
			await governance.changeDuration(lotteryAddress, newDuration, { from: accounts[1] }).should.be.rejected;
			await governance.changeDuration(lotteryAddress, 1, { from: deployer }).should.be.rejected;
			await governance.changeDuration(lotteryAddress, newDuration, { from: deployer });
			const duration = await governance.getDuration(lotteryAddress);
			assert.equal(duration, newDuration, 'The duration is changed');
		});

		it('changes the lottery fee', async () => {
			const newFee = 1000;
			await governance.changeFee(newFee, { from: accounts[1] }).should.be.rejected;
			await governance.changeFee(6000, { from: deployer }).should.be.rejected;
			await governance.changeFee(newFee, { from: deployer });
			const fee = await governance.lotteryFee();
			assert.equal(fee, newFee, 'The lotteryFee is changed');
			await governance.changeFee(newFee, { from: deployer }).should.be.rejected;
		});

		it('changes the randomness', async () => {
			const newRandomness = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
			const oldRandomness = await governance.randomness();
			await governance.changeRandom(newRandomness, { from: accounts[0] }).should.be.rejected;
			await governance.changeRandom(0, { from: deployer }).should.be.rejected;
			await governance.changeRandom(oldRandomness, { from: deployer }).should.be.rejected;
			await governance.changeRandom(newRandomness, { from: deployer });
			const result = await governance.randomness();
			assert.equal(newRandomness, result, 'Randomness contract changed');
			await governance.changeRandom(oldRandomness, { from: deployer });
		});

		it('cancels lottery', async () => {
			await governance.cancelLottery(lotteryAddress);
			const lotteryIsActive = await governance.validateLottery(lotteryAddress);
			assert.equal(lotteryIsActive, false, 'The lottery is cancelled');
		});

		it('active lotteries array', async () => {
			const result = await governance.getActiveLotteries();
			assert.equal(result.length, 2, 'No active lotteries');
		});
	});
});