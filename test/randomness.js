const Lottery645 = artifacts.require('./Lottery645.sol');
const Governance = artifacts.require('./Governance.sol');
const Randomness = artifacts.require('./Randomness.sol');

require('chai')
	.use(require('chai-as-promised'))
	.should();


contract('Randomness', ([deployer, ...accounts]) => {
	let lottery645, governance, randomness;

	before(async () => {
		governance = await Governance.deployed();
		randomness = await Randomness.deployed();
		lottery645 = await Lottery645.deployed();
	});

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await randomness.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);

		});
	});

	describe('protection', async () => {
		it('rejects external calls', async () => {
			await randomness.getRandom(1).should.be.rejected;
			await randomness.getRandom(1, { from: deployer }).should.be.rejected;
			await randomness.getRandom(1, { from: accounts[0] }).should.be.rejected;
		});

		it('changes the GasLimit', async () => {
			const newGasLimit = '1000000';
			await randomness.changeGasLimit(newGasLimit, { from: accounts[1] }).should.be.rejected;
			await randomness.changeGasLimit(newGasLimit, { from: deployer });
		});
	});
});