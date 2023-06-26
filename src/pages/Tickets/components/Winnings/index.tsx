import React from 'react';
import { AdditionalInfoRow, InfoText } from '../Ticket';
import { useTranslation } from 'react-i18next';
import { selectCurrency } from '../../../../state/user/slice';
import { lotteryNumbersBg } from '../../../../constants/colors';
import WithdrawButton from '../WithdrawButton';
import { useAppSelector } from '../../../../state/hooks';
import { LotteryTicket } from '../../../../state/ticket/types';

interface WinningsProps {
	ticket: LotteryTicket;
	withButton?: boolean;
}

const Winnings = ({ ticket, withButton }: WinningsProps) => {
	const { t } = useTranslation();
	const currency = useAppSelector(selectCurrency);
	const winText = ticket.isWithdrawing
		? t('transferring_winnings')
		: ticket.paidOut !== '0' ? t('winnings_received') : t('winnings');
	const numbersBg = lotteryNumbersBg[ticket.lotteryName];

	if (ticket.won === 0) return (
		<AdditionalInfoRow>
			{t('no_winnings')}
		</AdditionalInfoRow>
	);

	return (
		<>
			<AdditionalInfoRow>
				<InfoText isWin={ticket.paidOut === '0'} winColor={numbersBg}>
					{winText}
				</InfoText>
				<InfoText isWin={!!ticket.won} winColor={numbersBg}>
					{ticket.won} {currency}
				</InfoText>
			</AdditionalInfoRow>
			{
				withButton &&
				<WithdrawButton ticket={ticket} />
			}
		</>
	);
};

export default Winnings;
