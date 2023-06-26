import React, { useEffect } from 'react';
import { AdditionalInfoRow, TicketNumber, TopRow } from '../Ticket';
import styled from 'styled-components';
import { cardBgColor, lotteryNumbersBg } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { LOTTERY_LOGOS } from '../../../../constants/settings';
import { selectLotteryDraw } from '../../../../state/lottery/slice';
import { useHistory } from 'react-router-dom';
import NumbersRegular from '../../../../components/Numbers';
import DrawInfoRow from '../DrawInfoRow';
import Winnings from '../Winnings';
import { useAppSelector } from '../../../../state/hooks';
import { LotteryTicket } from '../../../../state/ticket/types';

const TicketDetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${cardBgColor};
  padding: 1.5rem;
  border-radius: 16px;
  gap: 1rem;
`;

interface TicketDetailsProps {
	ticket: LotteryTicket;
}

const TicketDetails = ({ ticket }: TicketDetailsProps) => {
	const { t } = useTranslation();
	const history = useHistory();
	const lotteryName = ticket.lotteryName;
	const Logo = LOTTERY_LOGOS[lotteryName];
	const drawData = useAppSelector(state => selectLotteryDraw(state, {
		lotteryName: lotteryName,
		drawId: ticket.ticketLotteryId
	}));

	useEffect(() => {
		if (!drawData) {
			history.push('/tickets');
		}
	}, [drawData, history]);

	if (!drawData) return null;
	const numbersBg = lotteryNumbersBg[lotteryName];

	return (
		<TicketDetailsWrapper>
			<TopRow>
				<TicketNumber isWin={!!ticket.won} winColor={numbersBg}>
					{t('#')}{ticket.ticketId}
				</TicketNumber>
				<Logo />
			</TopRow>
			<br />
			<AdditionalInfoRow>
				{t('your_numbers')}
			</AdditionalInfoRow>
			<NumbersRegular
				lotteryName={lotteryName}
				numFieldOne={ticket.pickedNumbers}
				numFieldTwo={ticket.pickedNumbersSecondField}
				numToMatchFieldOne={drawData.drawnNumbers}
				numToMatchFieldTwo={drawData.drawnNumbersSecondField}
			/>
			{
				drawData.drawnNumbers.length === 0
					? <>
						<br />
						<DrawInfoRow drawData={drawData} />
						<AdditionalInfoRow>
							{t('awaiting_drawing')}
						</AdditionalInfoRow>
					</>
					: <>
						<AdditionalInfoRow>
							{t('drawn_numbers')}
						</AdditionalInfoRow>
						<NumbersRegular
							lotteryName={lotteryName}
							numFieldOne={drawData.drawnNumbers}
							numFieldTwo={drawData.drawnNumbersSecondField}
							numToMatchFieldOne={ticket.pickedNumbers}
							numToMatchFieldTwo={ticket.pickedNumbersSecondField}
						/>
						<br />
						<DrawInfoRow drawData={drawData} />
						<Winnings ticket={ticket} withButton={true} />
					</>
			}
		</TicketDetailsWrapper>
	);
};

export default TicketDetails;
