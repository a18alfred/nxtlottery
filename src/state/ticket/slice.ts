import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { enterLottery, getUserTickets, getWinnings, LotteryToFetch } from '../../services/lotteryAPI';
import { fetchLotteryByArrayOfIds } from '../lottery/slice';
import { GLOBAL_SETTINGS, LOTTERY_SETTINGS } from '../../constants/settings';
import { checkTicketWinStatus } from '../../utils/helpers';
import { LotteryTicket, TicketState } from './types';
import { RootState, ThunkApi } from '../index';
import { Contract } from '@ethersproject/contracts';
import { LotteryInstanceByName, LotteryNameByAddress } from '../../context/web3/types';
import { LotteryNameType } from '../../constants/types';

const initialState: TicketState = {
	isLoading: false,
	totalAmountOfTickets: 0,
	isFetched: false,
	tickets: [],
	pendingTickets: {},
	currentPage: 0,
	hasMore: true,
	error: {
		withdrawError: null,
		fetchError: null,
		buyError: {}
	}
};

interface FetchUserTicketsPayload {
	ticketsInstance: Contract;
	lotteryNameByAddress: LotteryNameByAddress;
	lotteryInstanceByName: LotteryInstanceByName;
}

interface FetchUserTicketsResult {
	totalAmountOfTickets: number,
	tickets: LotteryTicket[],
	currentPage: number,
	hasMore: boolean
}

export const fetchUserTickets = createAsyncThunk<FetchUserTicketsResult, FetchUserTicketsPayload, ThunkApi>(
	'ticket/fetchUserTickets',
	async (props, { dispatch, getState }) => {
		const { ticketsInstance, lotteryNameByAddress, lotteryInstanceByName } = props;
		const currentState = getState().ticket;
		const userAddress = getState().user.address;

		if (!currentState.hasMore) {
			return {
				totalAmountOfTickets: currentState.totalAmountOfTickets,
				tickets: [],
				currentPage: currentState.currentPage,
				hasMore: currentState.hasMore
			};
		}

		const page = currentState.currentPage + 1;

		let totalAmountOfTickets: number = 0;
		let tickets: LotteryTicket[] = [];
		let lotteryToFetch: LotteryToFetch = {};
		let retries = 0;
		while (retries < GLOBAL_SETTINGS.fetchRetries) {
			try {
				({
					totalAmountOfTickets,
					tickets,
					lotteryToFetch
				} = await getUserTickets(
					ticketsInstance,
					userAddress,
					page,
					lotteryNameByAddress
				));
				break;
			} catch (e) {
				console.log(`Error fetching tickets, retrying in 3 seconds. Error: ${e}`);
				await new Promise(resolve => setTimeout(resolve, GLOBAL_SETTINGS.fetchRetryDelay));
				retries++;
			}
		}

		if (retries === GLOBAL_SETTINGS.fetchRetries) {
			throw new Error(`Fetch failed after ${retries} retries.`);
		}

		let promises = [];

		for (let lotteryName of Object.keys(lotteryToFetch)) {
			promises.push(
				await dispatch(fetchLotteryByArrayOfIds({
					lotteryName: lotteryName as LotteryNameType,
					toFetchIds: lotteryToFetch[lotteryName],
					lotteryInstanceByName: lotteryInstanceByName
				}))
			);
		}

		await Promise.all(promises);

		let lotteryState = getState().lottery;
		await checkTicketWinStatus({
			tickets: tickets,
			lotteryState: lotteryState
		});

		return {
			totalAmountOfTickets: totalAmountOfTickets,
			tickets: tickets,
			currentPage: page,
			hasMore: totalAmountOfTickets > page * GLOBAL_SETTINGS.fetchTicketsPerLoad
		};
	}
);

interface BuyLotteryTicketPayload {
	lotteryName: LotteryNameType;
	lotteryInstance: Contract;
	lotteryId: number;
	pickedNumbers: number[];
	drawTime: number;
	ticketValue: string;
	timeStamp: number;
}

interface BuyLotteryTicketResult {
}

export const buyLotteryTicket = createAsyncThunk<BuyLotteryTicketResult, BuyLotteryTicketPayload, ThunkApi>(
	'ticket/buyLotteryTicket',
	async (props, { dispatch, getState }) => {
		const { lotteryInstance, pickedNumbers, ticketValue } = props;
		const userAddress = getState().user.address;
		await enterLottery(lotteryInstance, pickedNumbers, ticketValue, userAddress);
	}
);

interface WithdrawTicketWinningsPayload {
	lotteryInstance: Contract;
	ticketId: number;
	value: string;
	ticketIndex: number;
}

interface WithdrawTicketWinningsResult {
	paidOut: string;
}

export const withdrawTicketWinnings = createAsyncThunk<WithdrawTicketWinningsResult, WithdrawTicketWinningsPayload, ThunkApi>(
	'ticket/withdrawWinnings',
	async (props, { dispatch, getState }) => {
		const { lotteryInstance, ticketId, value } = props;
		const userAddress = getState().user.address;

		await getWinnings(lotteryInstance, ticketId, userAddress);

		return {
			paidOut: value
		};
	}
);

export const ticketSlice = createSlice({
	name: 'ticket',
	initialState,
	reducers: {
		ticket_reset: () => initialState,
		error_reset: (state) => {
			state.error.fetchError = null;
			state.error.withdrawError = null;
			state.error.buyError = {};
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserTickets.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchUserTickets.fulfilled, (state, action) => {
				state.isLoading = false;
				state.totalAmountOfTickets = action.payload.totalAmountOfTickets;
				state.tickets = [...state.tickets, ...action.payload.tickets];
				state.currentPage = action.payload.currentPage;
				state.hasMore = action.payload.hasMore;
				state.error.fetchError = null;
				state.isFetched = true;
			})
			.addCase(fetchUserTickets.rejected, (state, action) => {
				state.error.fetchError = action.error;
				state.isLoading = false;
			})
			.addCase(buyLotteryTicket.pending, (state, action) => {
				state.pendingTickets[action.meta.arg.timeStamp] = {
					ticketId: action.meta.arg.timeStamp,
					lotteryAddress: '',
					ticketLotteryId: action.meta.arg.lotteryId,
					lotteryName: action.meta.arg.lotteryName,
					pickedNumbers: action.meta.arg.pickedNumbers.slice(0, LOTTERY_SETTINGS[action.meta.arg.lotteryName].minToPick),
					pickedNumbersSecondField: action.meta.arg.pickedNumbers.slice(LOTTERY_SETTINGS[action.meta.arg.lotteryName].minToPick),
					ticketValue: action.meta.arg.ticketValue,
					drawTime: action.meta.arg.drawTime,
					paidOut: '0',
					won: 0,
					sameCombinationCounter: 1,
					isWithdrawing: false,
					isPending: true
				};
			})
			.addCase(buyLotteryTicket.fulfilled, (state, action) => {
				state.pendingTickets[action.meta.arg.timeStamp].isPending = false;
				state.tickets = [];
				state.currentPage = 0;
				state.hasMore = true;
				state.isFetched = false;
				state.totalAmountOfTickets = 0;
			})
			.addCase(buyLotteryTicket.rejected, (state, action) => {
				state.pendingTickets[action.meta.arg.timeStamp].isPending = false;
				state.error.buyError[action.meta.arg.timeStamp] = action.error;
			})

			.addCase(withdrawTicketWinnings.pending, (state, action) => {
				state.tickets[action.meta.arg.ticketIndex].isWithdrawing = true;
			})
			.addCase(withdrawTicketWinnings.fulfilled, (state, action) => {
				state.tickets[action.meta.arg.ticketIndex].paidOut = action.payload.paidOut;
				state.tickets[action.meta.arg.ticketIndex].isWithdrawing = false;
				state.error.withdrawError = null;
			})
			.addCase(withdrawTicketWinnings.rejected, (state, action) => {
				state.tickets[action.meta.arg.ticketIndex].isWithdrawing = false;
				state.error.withdrawError = action.error;
			});
	}
});

export const {
	ticket_reset
} = ticketSlice.actions;

export const selectTicketLoadingState = (state: RootState) => state.ticket.isLoading;
export const selectTicketFirstFetchState = (state: RootState) => state.ticket.isFetched;
export const selectTicketTotal = (state: RootState) => state.ticket.totalAmountOfTickets;
export const selectTicketsArray = (state: RootState) => state.ticket.tickets;
export const selectPendingTickets = (state: RootState) => state.ticket.pendingTickets;
export const selectTicketHasMore = (state: RootState) => state.ticket.hasMore;
export const selectTicketError = (state: RootState) => state.ticket.error;

export const selectPendingTicketById = createSelector(
	[
		(state: RootState) => state.ticket,
		(state: RootState, pendingId: number) => pendingId
	],
	(ticket, pendingId) => ticket.pendingTickets[pendingId]
);

export default ticketSlice.reducer;


