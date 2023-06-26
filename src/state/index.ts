import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/slice';
import lotteryReducer from './lottery/slice';
import ticketReducer from './ticket/slice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		lottery: lotteryReducer,
		ticket: ticketReducer
	},
	devTools: false
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface ThunkApi {
	dispatch: AppDispatch;
	state: RootState;
}

export default store;