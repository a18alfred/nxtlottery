import { useWeb3 } from '../context/web3/web3';
import { selectTicketsArray, withdrawTicketWinnings } from '../state/ticket/slice';
import { LotteryNameType } from '../constants/types';
import { useAppDispatch, useAppSelector } from '../state/hooks';

export const useTicketWinnings = (lotteryName: LotteryNameType) => {
	const { lotteryInstanceByName } = useWeb3();
	const dispatch = useAppDispatch();
	const tickets = useAppSelector(selectTicketsArray);

	const withdrawWinnings = ({ ticketId, value }: { ticketId: number, value: string }) => {
		let ticketIndex: number | undefined = undefined;
		tickets.find((t, i) => {
			if (t.ticketId === ticketId) {
				ticketIndex = i;
				return true;
			}
			return false;
		});

		if (ticketIndex === undefined) return;
		dispatch(withdrawTicketWinnings({
			lotteryInstance: lotteryInstanceByName.current[lotteryName],
			ticketId: ticketId,
			ticketIndex: ticketIndex,
			value: value
		}));
	};

	return {
		withdrawWinnings
	};
};