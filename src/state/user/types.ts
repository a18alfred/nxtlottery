export interface Exchange {
	[key: string]: {
		[key: string]: number
	};
}

export interface User {
	isLoading: boolean;
	address: string;
	connected: boolean;
	chainId: number;
	chainName: string;
	currency: string;
	user_currency: string;
	exchange: Exchange;
	isAdmin: boolean;
	error: string;
}

export interface UserConnectedPayloadAction {
	address: string | undefined;
	chainId: number | undefined;
	chainName: string | undefined;
	currency: string | undefined;
}