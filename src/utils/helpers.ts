import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import Web3Utils from 'web3-utils';
import { LOTTERY_SETTINGS } from '../constants/settings';
import { LotterySettings } from '../constants/types';
import { Draw, LotteryState } from '../state/lottery/types';
import { LotteryTicket } from '../state/ticket/types';

export const truncate = (fullStr: string, strLen: number, separator?: string): string => {
	if (fullStr.length <= strLen) return fullStr;
	separator = separator || '...';
	const sepLen = separator.length,
		charsToShow = strLen - sepLen,
		frontChars = Math.ceil(charsToShow / 2),
		backChars = Math.floor(charsToShow / 2);
	return fullStr.slice(0, frontChars) + separator + fullStr.slice(fullStr.length - backChars);
};

export const unixToDate = (unixTime: number, lang: string): string => {
	const format = lang === 'ru' ? 'LLL' : 'lll';
	return moment.unix(unixTime).locale(lang).format(format);
};

export const getFilledArrayDesc = (start: number, end: number): number[] => {
	if (end <= 0) return [];
	let result: number[] = [];
	for (let i = end; i >= start; i--) {
		result.push(i);
	}
	return result;
};

export const multdec = (val1: number, val2: number): number => {
	return ((val1 * 100000 * val2) / 100000);
};

interface GetJackpotAndPrizeProps {
	settings: LotterySettings
	drawData: Draw
	ticket: LotteryTicket,
	matchedOne: number
	matchedSecond: number
}

const getJackpotAndPrize = ({
								settings,
								drawData,
								ticket,
								matchedOne,
								matchedSecond
							}: GetJackpotAndPrizeProps): number => {
	let jackpot = 0, prize = 0;
	const minPrice = +Web3Utils.fromWei(drawData.minimumPrice.toString(), 'ether');

	if (settings.secondField === null) {
		if (matchedOne >= settings.minToWin) {
			jackpot = matchedOne === settings.matchedToWinJackpot
				? +Web3Utils.fromWei(drawData.jackpot, 'ether')
				: 0;
			jackpot = jackpot / ticket.sameCombinationCounter;
			prize = multdec(minPrice, settings.prizeMultipliers[matchedOne]) + jackpot;
		}
	} else {
		if (matchedOne < matchedSecond) {
			[matchedOne, matchedSecond] = [matchedSecond, matchedOne];
		}

		if (matchedOne >= settings.minToWin || matchedSecond >= settings.minToWin) {
			jackpot = (matchedOne === settings.matchedToWinJackpot && matchedSecond === settings.matchedToWinJackpot)
				? +Web3Utils.fromWei(drawData.jackpot, 'ether')
				: 0;
			jackpot = jackpot / ticket.sameCombinationCounter;
			prize = multdec(minPrice, settings.prizeMultipliersTwoFields[matchedOne][matchedSecond]) + jackpot;
		}
	}
	return prize;
};

interface CheckTicketWinStatusProps {
	tickets: LotteryTicket[],
	lotteryState: LotteryState
}

export const checkTicketWinStatus = async ({ tickets, lotteryState }: CheckTicketWinStatusProps) => {
	for (let ticket of tickets) {
		const settings = LOTTERY_SETTINGS[ticket.lotteryName];
		const drawData = lotteryState[ticket.lotteryName].draws[ticket.ticketLotteryId];
		if (!drawData) continue;

		let matchedOne = 0, matchedSecond = 0;

		for (let i = 0; i < ticket.pickedNumbers.length; i++) {
			let isMatched = false;
			if (drawData.drawnNumbers.length !== 0) {
				isMatched = drawData.drawnNumbers.includes(ticket.pickedNumbers[i]);
			}
			if (isMatched) matchedOne++;
		}

		if (settings.secondField) {
			for (let i = 0; i < ticket.pickedNumbersSecondField.length; i++) {
				let isMatched = false;
				if (drawData.drawnNumbers.length !== 0) {
					isMatched = drawData.drawnNumbersSecondField.includes(ticket.pickedNumbersSecondField[i]);
				}
				if (isMatched) matchedSecond++;
			}
		}

		ticket['won'] = getJackpotAndPrize({
			settings: settings,
			drawData: drawData,
			ticket: ticket,
			matchedOne: matchedOne,
			matchedSecond: matchedSecond
		});
	}
};

export const getRandomObjectProperty = <T extends object>(obj: T): T[keyof T] => {
	const keys = Object.keys(obj) as (keyof T)[];
	return obj[keys[keys.length * Math.random() << 0]];
};

export const isNode = (value: any): value is Node => {
	return 'nodeType' in value;
};

export const waitFor = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export function customRace<T>(promise: Promise<T>, timeout: number): Promise<T | undefined> {
	let timer: NodeJS.Timeout | null = null;
	return Promise.race([
		new Promise<T | undefined>((resolve, reject) => {
			timer = setTimeout(() => resolve(undefined), timeout);
			return timer;
		}),
		promise.then((value: T) => {
			clearTimeout(timer!);
			return value;
		})
	]);
}
