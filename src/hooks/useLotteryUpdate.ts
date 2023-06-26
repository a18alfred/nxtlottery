import { useWeb3 } from '../context/web3/web3';
import {
	fetchLotteryCurrentId
} from '../state/lottery/slice';
import { LOTTERY_NAMES } from '../constants/settings';
import { useAppDispatch } from '../state/hooks';
import { LotteryNameType } from '../constants/types';

const useLotteryUpdate = () => {
	const { lotteryInstanceByNameReadOnly } = useWeb3();
	const dispatch = useAppDispatch();

	const fetchAllCurrent = async () => {
		for (let key in LOTTERY_NAMES) {
			const name = LOTTERY_NAMES[key];
			const lotteryInstance = lotteryInstanceByNameReadOnly.current[name];
			dispatch(fetchLotteryCurrentId({
				lotteryName: name,
				lotteryInstance: lotteryInstance
			}));
		}
	};

	const fetchCurrentByName = async (lotteryName: LotteryNameType) => {
		const lotteryInstance = lotteryInstanceByNameReadOnly.current[lotteryName];
		dispatch(fetchLotteryCurrentId({
			lotteryName: lotteryName,
			lotteryInstance: lotteryInstance
		}));
	};

	return { fetchAllCurrent, fetchCurrentByName };
};

export default useLotteryUpdate;