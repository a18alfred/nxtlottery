const Lottery645 = artifacts.require('./Lottery645.sol');
const Lottery420 = artifacts.require('./Lottery420.sol');
const Lottery749 = artifacts.require('./Lottery749.sol');
const Governance = artifacts.require('./Governance.sol');
const Randomness = artifacts.require('./Randomness.sol');
const Tickets = artifacts.require('./Tickets.sol');

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract('Tickets', ([deployer, ...accounts]) => {
	let lottery645, lottery420, lottery749, governance, randomness, tickets;

	before(async () => {
		governance = await Governance.deployed();
		randomness = await Randomness.deployed();
		lottery645 = await Lottery645.deployed();
		lottery420 = await Lottery420.deployed();
		lottery749 = await Lottery749.deployed();
		tickets = await Tickets.deployed();
	});

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await tickets.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		});
		it('has correct initial values', async () => {
			const numberOfTickets = await tickets.numberOfTickets();
			assert.equal(numberOfTickets, 0, 'numberOfTickets must be 0');
		});
	});

	describe('protection', async () => {
		it('rejects external calls', async () => {
			// Only lottery can create ticket
			const pickedNumbers = [1, 2, 3, 4, 5, 6];
			await tickets.createTicket(pickedNumbers, 1, accounts[1], {
				from: accounts[1]
			}).should.be.rejected;
			await tickets.createTicket(pickedNumbers, 1, accounts[0], {
				from: accounts[0]
			}).should.be.rejected;

			// Only lottery can set paidOut
			await tickets.setPaidOut(1, 0, { from: accounts[0] }).should.be.rejected;
			await tickets.setPaidOut(1, 0, { from: accounts[1] }).should.be.rejected;
		});
	});

	describe('ticket getter', async () => {
		it('return tickets', async () => {
			let results, gas;
			let pickedNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
			let minimumPrice = await governance.getMinimumPrice(await lottery420.address);
			await lottery420.manual_start_new_lottery();

			for (let i = 0; i < 15; i++) {
				await lottery420.enter(pickedNumbers, { from: deployer, value: minimumPrice });
			}
			results = await tickets.getUserTickets(1, 10);
			console.log(results.userTickets[1]);
		});
	});
});