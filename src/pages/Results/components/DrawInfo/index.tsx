import React from 'react';
import styled from 'styled-components';
import { cardBgColor, secondaryText, text } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { unixToDate } from '../../../../utils/helpers';
import Web3Utils from 'web3-utils';
import { selectCurrency } from '../../../../state/user/slice';
import NumbersRegular from '../../../../components/Numbers';
import { useAppSelector } from '../../../../state/hooks';
import { Draw } from '../../../../state/lottery/types';

const DrawInfoWrapper = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${cardBgColor};
  padding: 1.5rem;
  border-radius: 16px;
  gap: 1rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: -0.5rem;
`;

const DrawNumber = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  font-weight: 800;
  color: ${text};

  @media screen and (max-width: 520px) {
    font-size: clamp(1rem, -0.125rem + 5vw, 1.5rem);
  }
`;

const DateWrapper = styled.p`
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  color: ${secondaryText};

  @media screen and (max-width: 520px) {
    font-size: clamp(0.75rem, 0.1875rem + 2.5vw, 1rem);
  }
`;

const AdditionalInfoRow = styled.div`
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

const InfoText = styled.span`
`;

interface DrawInfoProps {
	draw: Draw;
}

const DrawInfo = React.memo(({ draw }: DrawInfoProps) => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const currency = useAppSelector(selectCurrency);

	return (
		<DrawInfoWrapper>
			<TopRow>
				<DrawNumber>
					{t('#')}{draw.id}
				</DrawNumber>
				<DateWrapper>
					{unixToDate(draw.drawTime, i18n.language)}
				</DateWrapper>
			</TopRow>
			<NumbersRegular
				lotteryName={draw.lotteryName}
				numFieldOne={draw.drawnNumbers}
				numFieldTwo={draw.drawnNumbersSecondField}
				numToMatchFieldOne={[]}
				numToMatchFieldTwo={[]}
			/>
			<AdditionalInfoRow>
				<InfoText>{t('number_of_sold_tickets')}: </InfoText>
				<InfoText>{draw.amountOfTickets}</InfoText>
			</AdditionalInfoRow>
			<AdditionalInfoRow>
				<InfoText>{t('jackpot')}:</InfoText>
				<InfoText>{Web3Utils.fromWei(draw.jackpot.toString(), 'ether')} {currency}</InfoText>
			</AdditionalInfoRow>
		</DrawInfoWrapper>
	);
});

export default DrawInfo;
