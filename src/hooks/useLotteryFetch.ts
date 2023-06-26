import { useWeb3 } from '../context/web3/web3';
import {
	fetchLotteryByArrayOfIds,
	selectLotteryByName
} from '../state/lottery/slice';
import { GLOBAL_SETTINGS } from '../constants/settings';
import { LotteryNameType } from '../constants/types';
import { useAppDispatch, useAppSelector } from '../state/hooks';

const useLotteryFetch = (lotteryName: LotteryNameType) => {
	const { lotteryInstanceByNameReadOnly } = useWeb3();
	const lottery = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const dispatch = useAppDispatch();

	const resultById = async (id: number) => {
		await dispatch(fetchLotteryByArrayOfIds({
			lotteryName: lotteryName,
			toFetchIds: [id],
			lotteryInstanceByName: lotteryInstanceByNameReadOnly.current
		}));
	};

	const resultsFetchMore = async () => {
		let perLoad = GLOBAL_SETTINGS.fetchDrawsPerLoad;
		const lastIdLoaded = lottery.lastIdLoaded;
		if (lastIdLoaded - perLoad <= 0) perLoad = lastIdLoaded - 1;
		const start = lastIdLoaded - perLoad;
		const end = lastIdLoaded - 1;
		let toFetchIds = [];
		for (let i = start; i <= end; i++) toFetchIds.push(i);
		await dispatch(fetchLotteryByArrayOfIds({
			lotteryName: lotteryName,
			toFetchIds: toFetchIds,
			lotteryInstanceByName: lotteryInstanceByNameReadOnly.current,
			lastIdLoaded: (lastIdLoaded - perLoad)
		}));
	};

	return { resultsFetchMore, resultById };
};

export default useLotteryFetch;