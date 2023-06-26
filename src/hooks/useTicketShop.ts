import { useWeb3 } from '../context/web3/web3';
import { buyLotteryTicket } from '../state/ticket/slice';
import { selectLotteryByName } from '../state/lottery/slice';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { LotteryNameType } from '../constants/types';

interface BuyTicketProps {
	pickedNumbers: number[]
	ticketValue: string,
	timeStamp: number
}

const useTicketShop = (lotteryName: LotteryNameType) => {
	const { lotteryInstanceByName } = useWeb3();
	const lotteryData = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const dispatch = useAppDispatch();
	const history = useHistory();

	const buyTicket = ({ pickedNumbers, ticketValue, timeStamp }: BuyTicketProps) => {
		const currentId = lotteryData.currentId;
		dispatch(buyLotteryTicket({
			lotteryName: lotteryName,
			lotteryInstance: lotteryInstanceByName.current[lotteryName],
			lotteryId: currentId,
			pickedNumbers: pickedNumbers,
			drawTime: lotteryData.draws[currentId].drawTime,
			ticketValue: ticketValue,
			timeStamp: timeStamp
		}));
		history.push(`/lotteries/${lotteryName}/buy/pending/${timeStamp}`);
	};
	return {
		buyTicket
	};
};

export default useTicketShop;
