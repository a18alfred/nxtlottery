import { LotteryNameType } from '../../constants/types';
import { Contract } from '@ethersproject/contracts';
import { MutableRefObject } from 'react';

export type LotteryNameByAddress = {
	[key: string]: LotteryNameType
}

export type LotteryInstanceByName = {
	[key: string]: Contract
}

export interface Network {
	[key: number]: { events: {}; links: {}; address: string; transactionHash: string; };
}

export interface Web3ContextState {
	ticketsInstance: MutableRefObject<Contract | undefined>;
	governanceInstance: MutableRefObject<Contract | undefined>;
	randomnessInstance: MutableRefObject<Contract | undefined>;
	lotteryNameByAddress: MutableRefObject<LotteryNameByAddress>;
	lotteryInstanceByName: MutableRefObject<LotteryInstanceByName>;
	lotteryInstanceByNameReadOnly: MutableRefObject<LotteryInstanceByName>;
}