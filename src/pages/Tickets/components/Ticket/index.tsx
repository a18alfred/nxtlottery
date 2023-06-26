import { MouseEvent, memo } from 'react';
import styled from 'styled-components';
import { LOTTERY_LOGOS } from '../../../../constants/settings';
import { useTranslation } from 'react-i18next';
import {
	text,
	secondaryText,
	cardBgColor,
	lotteryNumbersBg
} from '../../../../constants/colors';
import { selectLotteryDraw } from '../../../../state/lottery/slice';
import NumbersRegular from '../../../../components/Numbers';
import { useHistory } from 'react-router-dom';
import DrawInfoRow from '../DrawInfoRow';
import Winnings from '../Winnings';
import { useAppSelector } from '../../../../state/hooks';
import { LotteryTicket } from '../../../../state/ticket/types';

interface WithWinColor {
	isWin?: boolean;
	winColor?: string;
}

const TicketContainer = styled.li<{ isPending: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${cardBgColor};
  padding: 1.5rem;
  border-radius: 16px;
  gap: 1rem;
  cursor: ${({ isPending }) => isPending ? 'default' : 'pointer'};
`;

export const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-top: -0.5rem;

  svg {
    height: clamp(1.5rem, 1.0714rem + 1.9048vw, 2.5rem);
    width: auto;
    margin-bottom: -1.5rem;
  }
`;

export const TicketNumber = styled.h2<WithWinColor>`
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-size: 24px;
  font-weight: 800;
  color: ${({ isWin, winColor }) => isWin ? winColor : text};

  @media screen and (max-width: 520px) {
    font-size: clamp(1rem, -0.125rem + 5vw, 1.5rem);
  }
`;

export const AdditionalInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  color: ${secondaryText};
  @media screen and (max-width: 520px) {
    font-size: clamp(0.75rem, 0.1875rem + 2.5vw, 1rem);
  }
`;

export const InfoText = styled.span<WithWinColor>`
  color: ${({ isWin, winColor }) => isWin ? winColor : secondaryText};
  font-weight: ${({ isWin }) => isWin ? 600 : 500};
`;

interface TicketProps {
	ticket: LotteryTicket;
	isPending: boolean;
}

const Ticket = memo(({ ticket, isPending }: TicketProps) => {
	const { t } = useTranslation();
	const history = useHistory();
	const lotteryName = ticket.lotteryName;
	const numbersBg = lotteryNumbersBg[lotteryName];
	const drawData = useAppSelector(state => selectLotteryDraw(state, {
		lotteryName: lotteryName,
		drawId: ticket.ticketLotteryId
	}));
	if (!drawData) return null;
	const ticketIdText = isPending ? 'Ожидание оплаты' : `${t('#')}${ticket.ticketId}`;
	const awaitingText = isPending ? t('confirm_purchase') : t('awaiting_drawing');
	const Logo = LOTTERY_LOGOS[lotteryName];

	const handleClick = (e: MouseEvent<HTMLLIElement>) => {
		e.preventDefault();
		if (!isPending) history.push(`tickets/${ticket.ticketId}`);
	};

	return (
		<TicketContainer isPending={isPending} onClick={handleClick}>
			<TopRow>
				<TicketNumber isWin={!!ticket.won} winColor={numbersBg}>
					{ticketIdText}
				</TicketNumber>
				<Logo />
			</TopRow>
			<NumbersRegular
				lotteryName={lotteryName}
				numFieldOne={ticket.pickedNumbers}
				numFieldTwo={ticket.pickedNumbersSecondField}
				numToMatchFieldOne={drawData.drawnNumbers}
				numToMatchFieldTwo={drawData.drawnNumbersSecondField}
			/>
			<DrawInfoRow drawData={drawData} />
			{
				drawData.drawnNumbers.length === 0 ?
					<AdditionalInfoRow>
						{awaitingText}
					</AdditionalInfoRow>
					: <Winnings ticket={ticket} />
			}
		</TicketContainer>
	);
});

export default Ticket;
