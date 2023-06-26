import { ErrorType, LotteryNameType } from '../../constants/types';

export interface Draw {
	id: number,
	lotteryName: LotteryNameType,
	amountOfTickets: number,
	drawTime: number,
	drawnNumbers: number[],
	drawnNumbersSecondField: number[],
	jackpot: string,
	jackpotWinners: number,
	minimumPrice: string,
	state: number,
	totalValue: number
}

export type Draws = {
	[key: number]: Draw;
}

export interface Lottery {
	isLoading: boolean,
	isCurrentLoaded: boolean,
	currentId: number,
	draws: Draws,
	lotteryName: LotteryNameType,
	lastIdLoaded: number,
	error: ErrorType
}

export type LotteryState = {
	[key in LotteryNameType]: Lottery;
}