import { useWeb3 } from '../context/web3/web3';
import {
	fetchUserTickets
} from '../state/ticket/slice';
import { useAppDispatch } from '../state/hooks';

export const useTicketFetch = () => {
	const {
		ticketsInstance,
		lotteryNameByAddress,
		lotteryInstanceByNameReadOnly
	} = useWeb3();
	const dispatch = useAppDispatch();

	const fetchTickets = async () => {
		if (!ticketsInstance.current) return;
		await dispatch(fetchUserTickets({
			ticketsInstance: ticketsInstance.current,
			lotteryNameByAddress: lotteryNameByAddress.current,
			lotteryInstanceByName: lotteryInstanceByNameReadOnly.current
		}));
	};

	return {
		fetchTickets
	};
};