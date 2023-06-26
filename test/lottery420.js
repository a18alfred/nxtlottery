const Lottery420 = artifacts.require('./Lottery420.sol');
const Governance = artifacts.require('./Governance.sol');
const Tickets = artifacts.require('./Tickets.sol');

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract('Lottery420', ([deployer, ...accounts]) => {
	let lottery420, governance, tickets;
	let lotteryAddress;
	const correctFirstDrawTime = 1700291813;
	const correctInitialJackpot = web3.utils.toWei('1', 'Ether');

	before(async () => {
		governance = await Governance.deployed();
		lottery420 = await Lottery420.deployed();
		tickets = await Tickets.deployed();
		lotteryAddress = await lottery420.address;
	});

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await lottery420.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		});
		it('has correct initial values', async () => {
			const lotteryId = await lottery420.lotteryId();
			const growingJackpot = await lottery420.growingJackpot();
			assert.equal(lotteryId, 0, 'Initial lotteryId must be 0');
			assert.equal(growingJackpot, 0, 'growingJackpot must be 0');
		});
	});

	describe('starting a new lottery', async () => {
		it('started a new lottery draw with correct inital value', async () => {
			const minimumPrice = await governance.getMinimumPrice(lotteryAddress);

			let pickedNumbers = [1, 2, 3, 4, 1, 2, 3, 4];
			await lottery420.enter(pickedNumbers, {
				from: accounts[0],
				value: minimumPrice
			}).should.be.rejected;

			const receipt = await lottery420.manual_start_new_lottery();
			const lotteryId = await lottery420.lotteryId();
			assert.equal(lotteryId, 1, 'lotteryId must be 0');
			const lottery1 = await lottery420.getLotteryById(lotteryId);
			assert.equal(lottery1.id, 1, 'Lottery has correct lotteryId');
			assert.equal(lottery1.minimumPrice.toString(), minimumPrice.toString(), 'Lottery has correct minimumPrice');
			assert.equal(lottery1.state, 0, 'Lottery has correct state');
			assert.equal(lottery1.drawTime, correctFirstDrawTime, 'Lottery has correct drawTime');
			assert.equal(lottery1.drawnNumbers.length, 0, 'Lottery has 0 drawn numbers');
			assert.equal(lottery1.totalValue, 0, 'Initial totalValue is has to be 0 ');
			assert.equal(lottery1.jackpot, correctInitialJackpot, 'jackpot must be equal to initialJackpot');
			assert.equal(lottery1.jackpotWinners, 0, 'jackpotWinners must be equal to 0');

			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'NewLotteryStarted', 'should be the "NewLotteryStarted" event');
			assert.equal(receipt.logs[0].args._lotteryId, 1, 'logs the lotteryId number');
			const lotName = await lottery420.name();
			assert.equal(receipt.logs[0].args._name, lotName, 'logs the lottery name');
		});
	});

	describe('protection', async () => {
		it('rejects external calls', async () => {
			await lottery420.fulfill_drawing(1).should.be.rejected;
			await lottery420.fulfill_drawing(1, { from: deployer }).should.be.rejected;
			await lottery420.fulfill_drawing(1, { from: accounts[0] }).should.be.rejected;
			await lottery420.manual_start_new_lottery({ from: accounts[0] }).should.be.rejected;
		});
	});

	describe('tickets', async () => {
		it('buying tickets', async () => {
			const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
			const lotteryId = await lottery420.lotteryId();
			let totalValue = 0;
			let ticketCount = 0;

			await lottery420.enter([20, 1, 2, 3, 1, 2, 3, 4], {
				from: accounts[0],
				value: minimumPrice
			}).should.be.rejected;
			await lottery420.enter([1, 2, 3, 4, 1, 2, 3, 4, 5], {
				from: accounts[0],
				value: minimumPrice
			}).should.be.rejected;

			for (let i = 1; i <= 5; i++) {
				let pickedNumbers = [];
				for (let a = i; a < (i + 8); a++) {
					pickedNumbers.push(a);
				}
				let gasPrice = await lottery420.enter.estimateGas(pickedNumbers, {
					from: accounts[0],
					value: minimumPrice
				});
				console.log('gasPrice = ', gasPrice);
				const receipt = await lottery420.enter(pickedNumbers, { from: accounts[0], value: minimumPrice });
				totalValue += parseInt(minimumPrice.toString());
				ticketCount++;

				assert.equal(receipt.logs.length, 1, 'triggers one event');
				assert.equal(receipt.logs[0].event, 'TicketPurchased', 'should be the "TicketPurchased" event');
				assert.equal(receipt.logs[0].args._ticketId, i, 'logs the ticketId number');
				assert.equal(receipt.logs[0].args._ticketPrice.toString(), minimumPrice.toString(), 'logs the ticket price');
				assert.equal(receipt.logs[0].args._user, accounts[0], 'logs the user address who bought the ticket');

				const ticket = await tickets.getTicketById(i);

				assert.equal(ticket.ticketLotteryId.toString(), lotteryId.toString(), 'Ticket has correct lotteryId');
				assert.equal(ticket.pickedNumbers.toString(), pickedNumbers.toString(), 'Ticket has correct picked numbers');
				assert.equal(ticket.paidOut.toString(), 0, 'Ticket has correct paidOut');
			}


			let numberOfTickets = await tickets.numberOfTickets();
			assert.equal(numberOfTickets, 5, 'numberOfTickets is correct');

			// too many picked numbers
			let pickedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			let userInfo = await tickets.getUserTickets(0, 0, { from: accounts[0] });
			assert.equal(userInfo.totalAmountOfTickets, 5, 'Number of user0 tickets is correct');

			userInfo = await tickets.getUserTickets(1, 1, { from: accounts[1] });
			assert.equal(userInfo.totalAmountOfTickets, 0, 'Number of user1 tickets is correct');

			// not enough picked numbers
			pickedNumbers = [1, 2, 3, 4, 1, 2, 3];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// value sent is higher than correct ticket price
			pickedNumbers = [1, 2, 3, 4, 1, 2, 3, 4];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice * 28
			}).should.be.rejected;

			// value sent is too low and the balance is too low to cover the ticket
			pickedNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: 0
			}).should.be.rejected;

			const lottery = await lottery420.getLotteryById(lotteryId);
			assert.equal(lottery.totalValue.toString(), totalValue, 'totalValue is correct');
			assert.equal(lottery.state, 0, 'Lottery has correct state');
			assert.equal(lottery.drawnNumbers.length, 0, 'Lottery has 0 drawn numbers');
			assert.equal(lottery.amountOfTickets, ticketCount, 'Lottery has correct number of tickets');

			// Only lottery can create ticket
			pickedNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
			await tickets.createTicket(pickedNumbers, lotteryId, accounts[1], {
				from: accounts[1]
			}).should.be.rejected;
			await tickets.createTicket(pickedNumbers, lotteryId, accounts[0], {
				from: deployer
			}).should.be.rejected;

			// Not unique numbers
			pickedNumbers = [1, 19, 20, 20, 1, 2, 3, 4];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// Not unique numbers
			pickedNumbers = [1, 2, 3, 4, 1, 6, 6, 20];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// Not unique numbers
			pickedNumbers = [1, 2, 3, 4, 1, 1, 18, 19];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// Numbers out of range
			pickedNumbers = [1, 2, 3, 21, 1, 2, 3, 4];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// Numbers out of range
			pickedNumbers = [1, 2, 3, 4, 1, 2, 9, 30];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// Numbers not sorted
			pickedNumbers = [2, 1, 3, 4, 1, 2, 3, 4];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;

			// Numbers not sorted
			pickedNumbers = [1, 2, 3, 4, 2, 1, 3, 4];
			await lottery420.enter(pickedNumbers, {
				from: accounts[1],
				value: minimumPrice
			}).should.be.rejected;
		});
	});

	describe('lottery drawings', async () => {
		it('fulfills drawing', async () => {
			const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
			const lotteryFee = await governance.lotteryFee();
			let totalValue = '5000000000000000';
			const drawnNumbers = [1, 2, 3, 4, 1, 2, 3, 4];

			await lottery420.fulfill_drawing_tests();

			const lotteryId = await lottery420.lotteryId();
			assert.equal(lotteryId, 2, 'New lottery 2 started');

			let lot1 = await lottery420.getLotteryById(1);
			assert.equal(lot1.state, 2, 'state is correct');
			assert.equal(lot1.totalValue.toString(), totalValue, 'totalValue is correct');
			assert.equal(lot1.drawnNumbers.toString(), drawnNumbers.toString(), 'drawnNumbers is correct');
			assert.equal(lot1.minimumPrice.toString(), minimumPrice.toString(), 'minimumPrice is correct');
			assert.equal(lot1.jackpotWinners.toString(), '0', 'jackpotWinners is correct');

			// 15% of totalValue
			const expectedGrowingJackpot = '750000000000000';

			const expectedFee = Number(totalValue) / 10000 * Number(lotteryFee);

			let jackpot = await lottery420.growingJackpot();
			assert.equal(jackpot.toString(), expectedGrowingJackpot, 'jackpot is correct');

			let admin = await lottery420.getUser({ from: deployer });
			assert.equal(admin.toString(), expectedFee.toString(), 'admin balance is correct');
		});

		it('one ticket wins', async () => {
			const lotteryFee = await governance.lotteryFee();
			const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
			const numberOfTickets = await tickets.numberOfTickets();

			let pickedNumbers = [1, 2, 7, 8, 1, 6, 7, 8];

			await lottery420.enter(pickedNumbers, {
				from: accounts[4],
				value: minimumPrice
			});
			const winTicketNumber = parseInt(numberOfTickets.toString()) + 1;

			pickedNumbers = [5, 6, 7, 8, 9, 10, 11, 12];

			await lottery420.enter(pickedNumbers, {
				from: accounts[4],
				value: minimumPrice
			});

			const lostTicketNumber = parseInt(numberOfTickets.toString()) + 2;

			let adminBalance = await lottery420.getUser({ from: deployer });

			await lottery420.fulfill_drawing_tests();

			let receipt;
			let gasPrice = await lottery420.withdrawWinnings.estimateGas(winTicketNumber, { from: accounts[4] });
			console.log('Gas Withdraw Winnings = ', gasPrice);
			receipt = await lottery420.withdrawWinnings(winTicketNumber, { from: accounts[4] });
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'WithdrawWinnings', 'should be the "WithdrawWinnings" event');
			assert.equal(receipt.logs[0].args._user, accounts[4], 'logs the user address who withdrawn the prize');
			assert.equal(receipt.logs[0].args._value.toString(), (minimumPrice).toString(), 'logs the prize value');

			await lottery420.withdrawWinnings(winTicketNumber, { from: accounts[4] }).should.be.rejected;
			await lottery420.withdrawWinnings(lostTicketNumber, { from: accounts[4] }).should.be.rejected;

			const lot2 = await lottery420.getLotteryById(2);
			const totalValue = lot2.totalValue.toString();
			assert.equal(lot2.state, 2, 'state is correct');
			assert.equal(lot2.totalValue.toString(), (minimumPrice * 2).toString(), 'totalValue is correct');
			assert.equal(lot2.amountOfTickets, 2, 'amountOfTickets is correct');
			assert.equal(lot2.jackpotWinners.toString(), '0', 'jackpotWinners is correct');

			const expectedGrowingJackpot = '1050000000000000';
			const expectedFee = Number(totalValue) / 10000 * Number(lotteryFee);
			adminBalance = Number(adminBalance) + expectedFee;

			let adminBalanceNew = await lottery420.getUser({ from: deployer });
			assert.equal(adminBalanceNew.toString(), adminBalance.toString(), 'admin balance is correct');
			await lottery420.withdrawBalance(adminBalanceNew, { from: deployer });

			adminBalanceNew = await lottery420.getUser({ from: deployer });
			assert.equal(adminBalanceNew, 0, 'admin balance is correct');

			const jackpot = await lottery420.growingJackpot();
			assert.equal(jackpot.toString(), expectedGrowingJackpot, 'jackpot is correct');
		});

		// it('one ticket wins jackpot', async () => {
		// 	const lotteryId = await lottery420.lotteryId();
		// 	const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
		// 	let lot = await lottery420.getLotteryById(lotteryId);
		// 	const initialJackpot = lot.jackpot;
		//
		// 	let pickedNumbers = [1, 2, 3, 4, 1, 2, 3, 4];
		//
		// 	await lottery420.enter(pickedNumbers, {
		// 		from: accounts[6],
		// 		value: minimumPrice
		// 	});
		// 	const winnerTicketNumber = await tickets.numberOfTickets();
		//
		// 	pickedNumbers = [1, 10, 11, 12, 6, 7, 8, 10];
		//
		// 	await lottery420.enter(pickedNumbers, {
		// 		from: accounts[4],
		// 		value: minimumPrice
		// 	});
		//
		// 	const lostTicket1 = await tickets.numberOfTickets();
		//
		// 	pickedNumbers = [13, 14, 15, 16, 1, 10, 11, 12];
		//
		// 	await lottery420.enter(pickedNumbers, {
		// 		from: accounts[5],
		// 		value: minimumPrice
		// 	});
		//
		// 	const lostTicket2 = await tickets.numberOfTickets();
		//
		// 	await lottery420.fulfill_drawing_tests();
		//
		// 	lot = await lottery420.getLotteryById(lotteryId);
		// 	assert.equal(lot.state, 2, 'state is correct');
		// 	assert.equal(lot.amountOfTickets, 3, 'ticketsInPlay is correct');
		// 	assert.equal(lot.totalValue, (minimumPrice * 3).toString(), 'totalValue is correct');
		// 	assert.equal(lot.jackpot.toString(), initialJackpot.toString(), 'jackpot is correct');
		// 	assert.equal(lot.jackpotWinners.toString(), '1', 'jackpotWinners is 1');
		//
		// 	await lottery420.withdrawWinnings(lostTicket1, { from: accounts[4] }).should.be.rejected;
		// 	await lottery420.withdrawWinnings(lostTicket2, { from: accounts[5] }).should.be.rejected;
		//
		// 	await lottery420.withdrawWinnings(winnerTicketNumber, { from: deployer }).should.be.rejected;
		//
		// 	let ticket = await tickets.getTicketById(winnerTicketNumber);
		// 	assert.equal(ticket.paidOut.toString(), '0', 'PaidOut is correct');
		//
		// 	const receipt = await lottery420.withdrawWinnings(winnerTicketNumber, { from: accounts[6] });
		//
		// 	assert.equal(receipt.logs.length, 1, 'triggers one event');
		// 	assert.equal(receipt.logs[0].event, 'WithdrawWinnings', 'should be the "WithdrawWinnings" event');
		// 	assert.equal(receipt.logs[0].args._user, accounts[6], 'logs the user who withdraws the balance');
		// 	assert.equal(receipt.logs[0].args._value.toString(), initialJackpot.toString(), 'logs withdrawal value');
		//
		// 	ticket = await tickets.getTicketById(winnerTicketNumber);
		// 	assert.equal(ticket.paidOut.toString(), initialJackpot.toString(), 'PaidOut is correct');
		//
		// 	let growingJackpot = await lottery420.growingJackpot();
		// 	assert.equal(growingJackpot.toString(), '0', 'growingJackpot is correct');
		// });
		//
		// it('three tickets win jackpot', async () => {
		// 	// Assuming jackpot = 1 ETH
		// 	const lotteryId = await lottery420.lotteryId();
		// 	const minimumPrice = await governance.getMinimumPrice(lotteryAddress);
		//
		// 	let pickedNumbers = [1, 2, 3, 4, 1, 2, 3, 4];
		//
		// 	await lottery420.enter(pickedNumbers, {
		// 		from: accounts[6],
		// 		value: minimumPrice
		// 	});
		//
		// 	const winner1 = await tickets.numberOfTickets();
		//
		//
		// 	await lottery420.enter(pickedNumbers, {
		// 		from: accounts[7],
		// 		value: minimumPrice
		// 	});
		//
		// 	const winner2 = await tickets.numberOfTickets();
		//
		// 	await lottery420.enter(pickedNumbers, {
		// 		from: accounts[8],
		// 		value: minimumPrice
		// 	});
		//
		// 	const winner3 = await tickets.numberOfTickets();
		//
		// 	await lottery420.fulfill_drawing_tests();
		//
		// 	const lot = await lottery420.getLotteryById(lotteryId);
		// 	assert.equal(lot.jackpotWinners.toString(), '3', 'jackpotWinners is 3');
		//
		// 	await lottery420.withdrawWinnings(winner1, { from: accounts[6] });
		// 	await lottery420.withdrawWinnings(winner2, { from: accounts[7] });
		// 	const receipt = await lottery420.withdrawWinnings(winner3, { from: accounts[8] });
		//
		// 	assert.equal(receipt.logs.length, 1, 'triggers one event');
		// 	assert.equal(receipt.logs[0].event, 'WithdrawWinnings', 'should be the "WithdrawWinnings" event');
		// 	assert.equal(receipt.logs[0].args._user, accounts[8], 'logs the user who withdraws the balance');
		// 	assert.equal(receipt.logs[0].args._value.toString(), '333333333333333333', 'logs withdrawal value');
		//
		// 	let ticket = await tickets.getTicketById(winner1);
		// 	assert.equal(ticket.paidOut.toString(), '333333333333333333', 'paidOut is correct');
		// 	ticket = await tickets.getTicketById(winner2);
		// 	assert.equal(ticket.paidOut.toString(), '333333333333333333', 'paidOut is correct');
		// 	ticket = await tickets.getTicketById(winner3);
		// 	assert.equal(ticket.paidOut.toString(), '333333333333333333', 'paidOut is correct');
		// });
	});

	describe('deposit and withdraw', async () => {
		it('makes a deposit', async () => {
			const receipt = await lottery420.deposit({ from: accounts[1], value: web3.utils.toWei('10', 'Ether') });

			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Deposit', 'should be the "Deposit" event');
			assert.equal(receipt.logs[0].args._user, accounts[1], 'logs the user address who bought the ticket');
			assert.equal(receipt.logs[0].args._value, web3.utils.toWei('10', 'Ether'), 'logs deposit value');

			const user1 = await lottery420.getUser({ from: accounts[1] });
			assert.equal(user1, web3.utils.toWei('10', 'Ether'), 'balance is correct');
		});

		it('withdraws balance', async () => {
			await lottery420.withdrawBalance(web3.utils.toWei('0.00001', 'Ether'), { from: accounts[0] }).should.be.rejected;
			await lottery420.withdrawBalance(web3.utils.toWei('0.000001', 'Ether'), { from: accounts[2] }).should.be.rejected;

			const receipt = await lottery420.withdrawBalance(web3.utils.toWei('10', 'Ether'), { from: accounts[1] });

			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'WithdrawBalance', 'should be the "WithdrawBalance" event');
			assert.equal(receipt.logs[0].args._user, accounts[1], 'logs the user address who bought the ticket');
			assert.equal(receipt.logs[0].args._value, web3.utils.toWei('10', 'Ether'), 'logs withdraw value');

			const user1 = await lottery420.getUser({ from: accounts[1] });
			assert.equal(user1.toString(), 0, 'balance is correct');

			await lottery420.deposit({ from: accounts[1], value: web3.utils.toWei('10', 'Ether') });
			await lottery420.withdrawBalance(web3.utils.toWei('10', 'Ether'), { from: accounts[1] });
			await lottery420.deposit({ from: accounts[1], value: web3.utils.toWei('10', 'Ether') });
			await lottery420.withdrawBalance(web3.utils.toWei('10', 'Ether'), { from: accounts[1] });
		});
	});

	describe('lottery getter', async () => {
		it('returns lottery draws', async () => {
			let ids = [];

			for (let i = 0; i < 15; i++) {
				const lotteryId = await lottery420.lotteryId();
				ids.push(lotteryId);
				await lottery420.fulfill_drawing_tests();
			}

			const result = await lottery420.getLotteryByIds(ids);
			console.log(result[0]);
		});
	});
});