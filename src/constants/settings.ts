import { ReactComponent as Logo645 } from '../assets/images/645icon.svg';
import { ReactComponent as Logo749 } from '../assets/images/749icon.svg';
import { ReactComponent as Logo420 } from '../assets/images/420icon.svg';

import { ReactComponent as BannerSvgEn } from '../assets/images/try-your-luck-en.svg';
import { ReactComponent as BannerSvgRu } from '../assets/images/try-your-luck-ru.svg';

import { ReactComponent as NumbersSvgLight } from '../assets/images/numbers-image-light.svg';
import { ReactComponent as NumbersSvgDark } from '../assets/images/numbers-image-dark.svg';

import { ReactComponent as WinInfo645 } from '../assets/images/win-ticket645.svg';
import { ReactComponent as WinInfo749 } from '../assets/images/win-ticket749.svg';
import { ReactComponent as WinInfo420 } from '../assets/images/win-ticket420.svg';
import {
	GlobalSettingsTypes,
	LanguageSVGs, LotteryNameList,
	LotterySettingsAll,
	LotterySVGs,
	ThemeSVGs
} from './types';
import { Unit } from 'web3-utils';


export const LOTTERY_NAMES: LotteryNameList = {
	LOTTERY_420: 'lottery420',
	LOTTERY_645: 'lottery645',
	LOTTERY_749: 'lottery749'
};

export const LOTTERY_LOGOS: LotterySVGs = {
	'lottery645': Logo645,
	'lottery749': Logo749,
	'lottery420': Logo420
};

export const GLOBAL_SETTINGS: GlobalSettingsTypes = {
	defaultChainId: 80001,
	closedSaleTimeInSeconds: 300, // 5 minutes
	IntervalToShowTimerBeforeDrawInSeconds: 3600, // 1 hour
	fetchDrawsPerLoad: 50,
	fetchTicketsPerLoad: 50,
	fetchRetries: 3,
	fetchRetryDelay: 3000, // 3 Seconds,
	fetchCurrentAfterDrawInSeconds: 300 // 5 minutes
};

export const LOTTERY_SETTINGS: LotterySettingsAll = {
	'lottery645': {
		minNumber: 1,
		maxNumber: 45,
		minToPick: 6,
		minToWin: 2,
		secondField: null,
		minimumPrice: 0.01,
		initialJackpot: 2000,
		matchedToWinJackpot: 6,
		prizeMultipliers: {
			2: 1,
			3: 3,
			4: 30,
			5: 2000,
			6: 0
		},
		prizeMultipliersTwoFields: {}
	},
	'lottery749': {
		minNumber: 1,
		maxNumber: 49,
		minToPick: 7,
		minToWin: 2,
		secondField: null,
		minimumPrice: 0.005,
		initialJackpot: 10000,
		matchedToWinJackpot: 7,
		prizeMultipliers: {
			2: 1,
			3: 2,
			4: 7,
			5: 60,
			6: 3000,
			7: 0
		},
		prizeMultipliersTwoFields: {}
	},
	'lottery420': {
		minNumber: 1,
		maxNumber: 20,
		minToPick: 4,
		minToWin: 2,
		secondField: {
			minNumber: 1,
			maxNumber: 20,
			minToPick: 4,
			toPick: 4
		},
		minimumPrice: 0.02,
		initialJackpot: 10000,
		matchedToWinJackpot: 4,
		prizeMultipliers: {},
		prizeMultipliersTwoFields: {
			2: {
				0: 1.3,
				1: 1,
				2: 3.2
			},
			3: {
				0: 4.6,
				1: 4.2,
				2: 14.2,
				3: 31.3
			},
			4: {
				0: 71.7,
				1: 203.8,
				2: 208.5,
				3: 1508.3,
				4: 0
			}
		}
	}
};

export const GLOBAL_CALC_UNIT: Unit = 'ether';

export const TRY_YOUR_LUCK_BANNER: LanguageSVGs = {
	'ru': BannerSvgRu,
	'en': BannerSvgEn
};

export const NUMBERS_IMAGE: ThemeSVGs = {
	'light': NumbersSvgLight,
	'dark': NumbersSvgDark
};

export const WIN_NFO_IMAGE: LotterySVGs = {
	'lottery645': WinInfo645,
	'lottery749': WinInfo749,
	'lottery420': WinInfo420
};