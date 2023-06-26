import { GLOBAL_SETTINGS, LOTTERY_SETTINGS } from '../constants/settings';
import { Contract } from '@ethersproject/contracts';
import { cacheLotteryDraw } from './cache';
import { Draws } from '../state/lottery/types';
import { BigNumberish } from '@ethersproject/bignumber';
import { LotteryNameType } from '../constants/types';
import { LotteryNameByAddress } from '../context/web3/types';
import { LotteryTicket } from '../state/ticket/types';
import { customRace } from '../utils/helpers';

export const getCurrentLotteryPlusOne = async (
	lotteryInstance: Contract,
	lotteryName: LotteryNameType
): Promise<{ currentId: number, draws: Draws }> => {

	const response = await lotteryInstance.getCurrentLotteryPlusOne();
	const settings = LOTTERY_SETTINGS[lotteryName];

	let draws: Draws = {};
	for (let drawData of response.lotteryDraws) {
		let id = Number(drawData.id);
		if (id === 0) break;
		const drawnNumbers: number[] = drawData.drawnNumbers.map((item: BigNumberish) => Number(item));
		draws[id] = {
			id: id,
			lotteryName: lotteryName,
			amountOfTickets: Number(drawData.amountOfTickets),
			drawTime: Number(drawData.drawTime),
			drawnNumbers: drawnNumbers.slice(0, settings.minToPick),
			drawnNumbersSecondField: drawnNumbers.slice(settings.minToPick),
			jackpot: drawData.jackpot.toString(),
			jackpotWinners: Number(drawData.jackpotWinners),
			minimumPrice: drawData.minimumPrice.toString(),
			state: drawData.state,
			totalValue: drawData.totalValue.toString()
		};
	}

	return {
		currentId: Number(response.currentId),
		draws: draws
	};
};

export const getLotteryByIds = async (
	lotteryInstance: Contract,
	lotteryName: LotteryNameType,
	toFetchIds: number[]
): Promise<Draws> => {

	let draws: Draws = {};
	const response = await lotteryInstance.getLotteryByIds(toFetchIds);
	const settings = LOTTERY_SETTINGS[lotteryName];

	for (let drawData of response) {
		let id = Number(drawData.id);
		const drawnNumbers: number[] = drawData.drawnNumbers.map((item: BigNumberish) => Number(item));
		draws[id] = {
			id: id,
			lotteryName: lotteryName,
			amountOfTickets: Number(drawData.amountOfTickets),
			drawTime: drawData.drawTime.toString(),
			drawnNumbers: drawnNumbers.slice(0, settings.minToPick),
			drawnNumbersSecondField: drawnNumbers.slice(settings.minToPick),
			jackpot: drawData.jackpot.toString(),
			jackpotWinners: Number(drawData.jackpotWinners),
			minimumPrice: drawData.minimumPrice.toString(),
			state: Number(drawData.state),
			totalValue: drawData.totalValue.toString()
		};
		if (draws[id].drawnNumbers.length > 0) cacheLotteryDraw({ lotteryName: lotteryName, draw: draws[id] });
	}

	return draws;
};

export const enterLottery = async (
	lotteryInstance: Contract,
	pickedNumbers: number[],
	ticketValue: string,
	userAddress: string
) => {
	const tx = await lotteryInstance
		.enter(pickedNumbers, {
			from: userAddress,
			value: ticketValue
		});
	await customRace(tx.wait(1), 10000);
	// await tx.wait();
	// const rc = await tx.wait(1);
	// const event = rc.events.find(event => event.event === 'TicketPurchased');
	// const [newTicket] = event.args;
	// return Number(newTicket);
};

export type LotteryToFetch = {
	[key: string]: number[];
}

export const getUserTickets = async (
	ticketsInstance: Contract,
	userAddress: string,
	page: number,
	lotteryNameByAddress: LotteryNameByAddress
): Promise<{ totalAmountOfTickets: number, tickets: LotteryTicket[], lotteryToFetch: LotteryToFetch }> => {
	const response = await ticketsInstance.getUserTickets(page, GLOBAL_SETTINGS.fetchTicketsPerLoad, { from: userAddress });

	let tickets: LotteryTicket[] = [];
	let lotteryToFetch: LotteryToFetch = {};

	for (let ticketData of response.userTickets) {
		let ticketId = Number(ticketData.ticketId);
		if (ticketId === 0) break;
		const lotteryName = lotteryNameByAddress[ticketData.lotteryAddress] as LotteryNameType;
		const settings = LOTTERY_SETTINGS[lotteryName];
		const ticketLotteryId = Number(ticketData.ticketLotteryId);
		const pickedNumbers: number[] = ticketData.pickedNumbers.map((item: BigNumberish) => Number(item));
		let ticket: LotteryTicket = {
			ticketId: ticketId,
			lotteryAddress: ticketData.lotteryAddress,
			ticketLotteryId: ticketLotteryId,
			pickedNumbers: pickedNumbers.slice(0, settings.minToPick),
			pickedNumbersSecondField: pickedNumbers.slice(settings.minToPick),
			paidOut: ticketData.paidOut.toString(),
			won: 0,
			sameCombinationCounter: Number(ticketData.sameCombinationCounter),
			lotteryName: lotteryName,
			isPending: false,
			isWithdrawing: false
		};
		tickets.push(ticket);

		if (!lotteryToFetch[lotteryName]) lotteryToFetch[lotteryName] = [];
		if (!lotteryToFetch[lotteryName].includes(ticketLotteryId))
			lotteryToFetch[lotteryName].push(ticketLotteryId);
	}

	return {
		totalAmountOfTickets: Number(response.totalAmountOfTickets),
		tickets: tickets,
		lotteryToFetch: lotteryToFetch
	};
};

export const getWinnings = async (
	lotteryInstance: Contract,
	ticketId: number,
	userAddress: string
) => {
	await lotteryInstance
		.withdrawWinnings(ticketId, {
			from: userAddress
		});
	// await customRace(tx.wait(1), 10000);
};

export const getAdminAddress = async (governanceInstance: Contract): Promise<string> => {
	return await governanceInstance.admin() as string;
};


