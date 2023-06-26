import { LotteryNameType } from '../constants/types';
import { Draw, Draws } from '../state/lottery/types';

export interface GetCachedPropsType {
	lotteryName: LotteryNameType,
	ids: number[]
}

export const getCachedLotteryDraws = ({ lotteryName, ids }: GetCachedPropsType): [Draws, number[]] => {
	let draws: Draws = {};
	let filteredIds: number[] = [];
	for (let id of ids) {
		const key = `nxtlottery_${lotteryName}_draws_${id}`;
		const retrievedDwaw = window.localStorage.getItem(key);
		if (retrievedDwaw) {
			let draw = JSON.parse(retrievedDwaw);
			draws[id] = draw as Draw;
		} else
			filteredIds.push(id);
	}
	return [draws, filteredIds];
};

export interface CacheLotteryPropsType {
	lotteryName: LotteryNameType,
	draw: Draw
}

export const cacheLotteryDraw = ({ lotteryName, draw }: CacheLotteryPropsType) => {
	const key = `nxtlottery_${lotteryName}_draws_${draw.id}`;
	window.localStorage.setItem(key, JSON.stringify(draw));
};