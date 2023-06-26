import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contract } from '@ethersproject/contracts';
import { getAdminAddress } from '../../services/lotteryAPI';
import { User, UserConnectedPayloadAction } from './types';
import { RootState, ThunkApi } from '../index';

const initialState: User = {
	isLoading: false,
	address: '',
	connected: false,
	chainId: 80001,
	chainName: '',
	currency: 'MATIC',
	user_currency: 'usd',
	exchange: {
		MATIC: {
			usd: 0,
			rub: 0
		},
		ETH: {
			usd: 0,
			rub: 0
		},
		BNB: {
			usd: 0,
			rub: 0
		}
	},
	isAdmin: false,
	error: ''
};


interface GetAdminPayload {
	governanceInstance: Contract;

}

interface GetAdminResult {
	isAdmin: boolean;
}

export const getAdmin = createAsyncThunk<GetAdminResult, GetAdminPayload, ThunkApi>(
	'user/getAdmin',
	async (props, { getState }) => {
		const { governanceInstance } = props;
		const { address } = getState().user;
		const admin = await getAdminAddress(governanceInstance);
		if (address && admin) {
			return {
				isAdmin: address.toLowerCase() === admin.toLowerCase()
			};
		} else
			return {
				isAdmin: false
			};
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		user_loading: (state) => {
			state.isLoading = true;
		},
		user_disconnected: () => initialState,
		user_connected: (state, action: PayloadAction<UserConnectedPayloadAction>) => {
			state.isLoading = false;
			state.address = action.payload.address ? action.payload.address : state.address;
			state.connected = true;
			state.chainId = action.payload.chainId ? action.payload.chainId : state.chainId;
			state.chainName = action.payload.chainName ? action.payload.chainName : state.chainName;
			state.currency = action.payload.currency ? action.payload.currency : state.currency;
			state.isAdmin = false;
			state.error = '';
		},
		update_exchangeRate: (state, action) => {
			state.exchange = action.payload.exchange;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAdmin.fulfilled, (state, action) => {
				state.isAdmin = action.payload.isAdmin;
			})
			.addCase(getAdmin.rejected, (state, action) => {
				console.log(action.error);
			});
	}
});

export const {
	user_loading,
	user_disconnected,
	user_connected,
	update_exchangeRate
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectCurrency = (state: RootState) => state.user.currency;
export const selectUserConnectionStatus = (state: RootState) => state.user.connected;
export const selectUserAddress = (state: RootState) => state.user.address;
export const selectIsAdmin = (state: RootState) => state.user.isAdmin;
export const selectUserChainName = (state: RootState) => state.user.chainName;

export default userSlice.reducer;
