import React from 'react';
import { Theme } from '../context/theme/types';

export type LotteryNameType = 'lottery420' | 'lottery645' | 'lottery749'

export type LotterySVGs = {
	[key in LotteryNameType]: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type LanguageSVGs = {
	[key: string]: React.FC<React.SVGProps<SVGSVGElement>>
};

export type ThemeSVGs = {
	[key in Theme]: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type LotteryNameList = {
	[key: string]: LotteryNameType
}

export type GlobalSettingsTypes = {
	defaultChainId: number,
	closedSaleTimeInSeconds: number
	IntervalToShowTimerBeforeDrawInSeconds: number
	fetchDrawsPerLoad: number
	fetchTicketsPerLoad: number
	fetchRetries: number
	fetchRetryDelay: number
	fetchCurrentAfterDrawInSeconds: number
}

export type LotterySettingsAll = {
	[key in LotteryNameType]: LotterySettings
};

export type LotterySettings = {
	minNumber: number
	maxNumber: number
	minToPick: number
	minToWin: number
	secondField: FieldSettings | null
	minimumPrice: number
	initialJackpot: number
	matchedToWinJackpot: number
	prizeMultipliers: PrizeMultipliers
	prizeMultipliersTwoFields: PrizeMultipliersTwoFields
}

type FieldSettings = {
	minNumber: number
	maxNumber: number
	minToPick: number
	toPick: number
}

type PrizeMultipliers = {
	[key: number]: number
}

type PrizeMultipliersTwoFields = {
	[key: number]: { [key: number]: number }
}

export type ErrorType = string | object | null

export type WithChildren = {
	children?: React.ReactNode
};

export type LotterySpecificColor = {
	[key in LotteryNameType]: string
};

export interface NumbersField {
	field1: {
		numbers: number[],
		percent: number
	},
	field2: {
		numbers: number[],
		percent: number
	}
}

export interface RouteParamLotteryName {
	lotteryName: LotteryNameType;
}
