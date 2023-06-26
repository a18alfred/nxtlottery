import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { GLOBAL_SETTINGS, LOTTERY_NAMES } from '../../constants/settings';
import { getCurrentLotteryPlusOne, getLotteryByIds } from '../../services/lotteryAPI';
import { getCachedLotteryDraws } from '../../services/cache';
import { Draws, LotteryState } from './types';
import { Contract } from '@ethersproject/contracts';
import { LotteryNameType } from '../../constants/types';
import { RootState, ThunkApi } from '../index';
import { LotteryInstanceByName } from '../../context/web3/types';

const initialState: LotteryState = {
	lottery645: {
		isLoading: true,
		isCurrentLoaded: false,
		currentId: 0,
		draws: {},
		lotteryName: LOTTERY_NAMES.LOTTERY_645,
		lastIdLoaded: 0,
		error: null
	},
	lottery749: {
		isLoading: true,
		isCurrentLoaded: false,
		currentId: 0,
		draws: {},
		lotteryName: LOTTERY_NAMES.LOTTERY_749,
		lastIdLoaded: 0,
		error: null
	},
	lottery420: {
		isLoading: true,
		isCurrentLoaded: false,
		currentId: 0,
		draws: {},
		lotteryName: LOTTERY_NAMES.LOTTERY_420,
		lastIdLoaded: 0,
		error: null
	}
};

interface FetchLotteryCurrentIdPayload {
	lotteryName: LotteryNameType;
	lotteryInstance: Contract;
}

interface FetchLotteryCurrentIdResult {
	currentId: number;
	draws: Draws;
	lastIdLoaded: number;
}

export const fetchLotteryCurrentId = createAsyncThunk<FetchLotteryCurrentIdResult, FetchLotteryCurrentIdPayload, ThunkApi>(
	'lottery/fetchCurrentId',
	async (props, { getState }) => {
		const { lotteryName, lotteryInstance } = props;
		const lottery = getState().lottery[lotteryName];

		let currentId: number = 0;
		let draws: Draws = {};
		let retries = 0;
		while (retries < GLOBAL_SETTINGS.fetchRetries) {
			try {
				({ currentId, draws } = await getCurrentLotteryPlusOne(lotteryInstance, lotteryName));
				break;
			} catch (e) {
				console.log(`Error fetching lottery, retrying in 3 seconds. Error: ${e}`);
				await new Promise(resolve => setTimeout(resolve, GLOBAL_SETTINGS.fetchRetryDelay));
				retries++;
			}
		}

		if (retries === GLOBAL_SETTINGS.fetchRetries) {
			throw new Error(`Fetch failed after ${retries} retries.`);
		}

		const updatedLastIdLoaded = lottery.lastIdLoaded === 0 ? currentId - 1 : lottery.lastIdLoaded;

		return {
			currentId: currentId,
			draws: draws,
			lastIdLoaded: updatedLastIdLoaded
		};
	}
);

interface FetchLotteryByArrayOfIdsPayload {
	lotteryName: LotteryNameType;
	toFetchIds: number[];
	lotteryInstanceByName: LotteryInstanceByName;
	lastIdLoaded?: number;
}

interface FetchLotteryByArrayOfIdsResult {
	draws: Draws,
	lastIdLoaded: number
}

export const fetchLotteryByArrayOfIds = createAsyncThunk<FetchLotteryByArrayOfIdsResult, FetchLotteryByArrayOfIdsPayload, ThunkApi>(
	'lottery/fetchByArrayOfIds',
	async (props, { getState }) => {
		const { lotteryName, toFetchIds, lotteryInstanceByName, lastIdLoaded } = props;
		const lottery = getState().lottery[lotteryName];
		const filteredIds = toFetchIds.filter(id => !(id in lottery.draws));

		const [cachedDraws, cacheFilteredIds] = getCachedLotteryDraws({ lotteryName: lotteryName, ids: filteredIds });

		let fetchedDraws: Draws = {};

		let retries = 0;
		while (retries < GLOBAL_SETTINGS.fetchRetries) {
			try {
				if (cacheFilteredIds.length > 0)
					fetchedDraws = await getLotteryByIds(
						lotteryInstanceByName[lotteryName],
						lotteryName,
						cacheFilteredIds
					);
				break;
			} catch (e) {
				console.log(`Error fetching lottery, retrying in 3 seconds. Error: ${e}`);
				await new Promise(resolve => setTimeout(resolve, GLOBAL_SETTINGS.fetchRetryDelay));
				retries++;
			}
		}

		if (retries === GLOBAL_SETTINGS.fetchRetries) {
			throw new Error(`Fetch failed after ${retries} retries.`);
		}

		const updatedLastIdLoaded = lastIdLoaded ? lastIdLoaded : lottery.lastIdLoaded;

		return {
			draws: { ...cachedDraws, ...fetchedDraws },
			lastIdLoaded: updatedLastIdLoaded
		};
	}
);

export const lotterySlice = createSlice({
	name: 'lottery',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLotteryCurrentId.pending, (state, action) => {
				state[action.meta.arg.lotteryName].isLoading = true;
				state[action.meta.arg.lotteryName].error = null;
			})
			.addCase(fetchLotteryCurrentId.fulfilled, (state, action) => {
				state[action.meta.arg.lotteryName].currentId = action.payload.currentId;
				state[action.meta.arg.lotteryName].lastIdLoaded = action.payload.lastIdLoaded;
				state[action.meta.arg.lotteryName].draws = { ...state[action.meta.arg.lotteryName].draws, ...action.payload.draws };
				state[action.meta.arg.lotteryName].isLoading = false;
				state[action.meta.arg.lotteryName].isCurrentLoaded = true;
			})
			.addCase(fetchLotteryCurrentId.rejected, (state, action) => {
				state[action.meta.arg.lotteryName].error = action.error;
				state[action.meta.arg.lotteryName].isLoading = false;
				state[action.meta.arg.lotteryName].error = action.error;
			})
			.addCase(fetchLotteryByArrayOfIds.pending, (state, action) => {
				state[action.meta.arg.lotteryName].isLoading = true;
				state[action.meta.arg.lotteryName].error = null;
			})
			.addCase(fetchLotteryByArrayOfIds.fulfilled, (state, action) => {
				state[action.meta.arg.lotteryName].draws = { ...state[action.meta.arg.lotteryName].draws, ...action.payload.draws };
				state[action.meta.arg.lotteryName].isLoading = false;
				state[action.meta.arg.lotteryName].lastIdLoaded = action.payload.lastIdLoaded;
			})
			.addCase(fetchLotteryByArrayOfIds.rejected, (state, action) => {
				state[action.meta.arg.lotteryName].isLoading = false;
				state[action.meta.arg.lotteryName].error = action.error;
			});
	}
});

export const selectLottery = (state: RootState) => state.lottery;
export const selectLotteryByName = createSelector(
	[
		(state: RootState) => state.lottery,
		(state: RootState, lotteryName: LotteryNameType) => lotteryName
	],
	(lottery, lotteryName) => lottery[lotteryName]
);

export const selectLotteryCurrentIdByName = createSelector(
	[
		(state: RootState) => state.lottery,
		(state: RootState, lotteryName: LotteryNameType) => lotteryName
	],
	(lottery, lotteryName) => lottery[lotteryName].currentId
);

export const selectLotteryIsCurrentLoaded = createSelector(
	[
		(state: RootState) => state.lottery,
		(state: RootState, lotteryName: LotteryNameType) => lotteryName
	],
	(lottery, lotteryName) => lottery[lotteryName].isCurrentLoaded
);

export const selectLotteryIsLoading = createSelector(
	[
		(state: RootState) => state.lottery,
		(state: RootState, lotteryName: LotteryNameType) => lotteryName
	],
	(lottery, lotteryName) => lottery[lotteryName].isLoading
);

export const selectLotteryLastIdLoaded = createSelector(
	[
		(state: RootState) => state.lottery,
		(state: RootState, lotteryName: LotteryNameType) => lotteryName
	],
	(lottery, lotteryName) => lottery[lotteryName].lastIdLoaded
);

export const selectLotteryDraw = createSelector(
	[
		(state: RootState) => state.lottery,
		(state: RootState, props) => props
	],
	(lottery, props: { lotteryName: LotteryNameType, drawId: number }) => lottery[props.lotteryName].draws[props.drawId]
);

export default lotterySlice.reducer;
