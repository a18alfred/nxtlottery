import { ErrorType, LotteryNameType } from '../../constants/types';

export interface LotteryTicket {
	ticketId: number,
	lotteryAddress: string,
	ticketLotteryId: number,
	pickedNumbers: number[],
	pickedNumbersSecondField: number[],
	paidOut: string,
	won: number,
	sameCombinationCounter: number,
	lotteryName: LotteryNameType,
	isPending: boolean,
	isWithdrawing: boolean,
}

export type BuyErrorType = {
	[key: number]: ErrorType
}

export interface LotteryTicketPending extends LotteryTicket {
	ticketValue: string,
	drawTime: number
}

export type PendingTickets = {
	[key: number]: LotteryTicketPending
}

export interface TicketState {
	isLoading: boolean,
	totalAmountOfTickets: number,
	isFetched: boolean,
	tickets: LotteryTicket[],
	pendingTickets: PendingTickets,
	currentPage: number,
	hasMore: boolean,
	error: {
		withdrawError: ErrorType,
		fetchError: ErrorType,
		buyError: BuyErrorType
	}
}