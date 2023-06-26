import { MouseEvent } from 'react';
import { TicketButton } from '../../../../components/Button';
import { lotteryColorBtn } from '../../../../constants/colors';
import { useTicketWinnings } from '../../../../hooks/useTicketWinnings';
import { useTranslation } from 'react-i18next';
import Web3Utils from 'web3-utils';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import styled from 'styled-components';
import { LotteryTicket } from '../../../../state/ticket/types';
import { GLOBAL_CALC_UNIT } from '../../../../constants/settings';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: -1rem 0;
`;

interface WithdrawButtonProps {
	ticket: LotteryTicket;
}

const WithdrawButton = ({ ticket }: WithdrawButtonProps) => {
	const { t } = useTranslation();
	const lotteryBtnBg = lotteryColorBtn[ticket.lotteryName];
	const { withdrawWinnings } = useTicketWinnings(ticket.lotteryName);

	const onWithdraw = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		withdrawWinnings({
			ticketId: ticket.ticketId,
			value: Web3Utils.toWei(ticket.won.toString(), GLOBAL_CALC_UNIT)
		});
	};

	if (ticket.paidOut !== '0') return null;

	if (ticket.isWithdrawing) return (
		<LoaderWrapper>
			<RotatingTrianglesLoader />
		</LoaderWrapper>
	);

	return (
		<TicketButton bgColor={lotteryBtnBg} onClick={onWithdraw}>
			{t('withdraw_winnings')}
		</TicketButton>
	);
};

export default WithdrawButton;
