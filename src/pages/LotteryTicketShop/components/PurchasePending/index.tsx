import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import {
	cardBgColor,
	secondaryText,
	text
} from '../../../../constants/colors';
import { selectPendingTicketById } from '../../../../state/ticket/slice';
import { LOTTERY_LOGOS } from '../../../../constants/settings';
import { useTranslation } from 'react-i18next';
import Web3Utils from 'web3-utils';
import { unixToDate } from '../../../../utils/helpers';
import { selectCurrency } from '../../../../state/user/slice';
import NumbersLarge from '../../../../components/Numbers/NumbersLarge';
import { bottomMarginGeneral } from '../../../../context/theme/style';
import { useAppSelector } from '../../../../state/hooks';
import { RouteParamLotteryName } from '../../../../constants/types';

const PendingPurchaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${bottomMarginGeneral};
  gap: 1rem;

  @media screen and (max-width: 880px) {
    margin-bottom: 85px;
  }
`;

const LargeText = styled.h3`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
  text-align: center;

  @media screen and (max-width: 512px) {
    font-size: clamp(1.125rem, 0.0985rem + 4.3796vw, 1.5rem);
  }
`;

const LargeTextSecondary = styled.p`
  font-size: 24px;
  text-align: center;
  font-weight: 800;
  color: ${secondaryText};
  margin-top: 1rem;

  @media screen and (max-width: 520px) {
    font-size: 18px;
    margin-top: 0;
  }
`;

const TicketInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  border-radius: 16px;
  padding: 1.5rem 1.5rem 2.5rem 1.5rem;
  background: ${cardBgColor};
  margin-bottom: 1rem;
  gap: 3rem;
  width: 100%;

  @media screen and (max-width: 880px) {
    padding: 1.5rem;
    font-size: 18px;
    margin-top: 0;
    gap: 2rem;
  }
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-top: -0.5rem;
  gap: 1rem;

  @media screen and (max-width: 512px) {
    grid-template-columns: 1fr ;
  }
`;

const TimeDrawWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media screen and (max-width: 512px) {
    justify-content: center;
    align-content: center;
  }
`;

const TicketTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${text};

  @media screen and (max-width: 512px) {
    text-align: center;
    width: 100%;
  }
`;

const LogoWrapper = styled.div`
  svg {
    width: 100%;
    height: 6rem;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 430px) {
    svg {
      height: 4rem;
    }
  }
`;

const MediumText = styled.p`
  text-align: right;
  font-size: 16px;
  font-weight: 800;
  color: ${secondaryText};

  @media screen and (max-width: 512px) {
    font-size: 16px;
    text-align: center;
    font-weight: 800;
  }
`;

interface RouteParams extends RouteParamLotteryName {
	pendingId: string;
}

const PurchasePending = () => {
	const history = useHistory();
	const { lotteryName, pendingId } = useParams<RouteParams>();
	const currency = useAppSelector(selectCurrency);
	const { i18n } = useTranslation();
	const { t } = useTranslation();
	const pendingTicket = useAppSelector(state => selectPendingTicketById(state, parseInt(pendingId)));

	useEffect(() => {
		if (!pendingTicket) history.push(`/lotteries/${lotteryName}/buy`);
		if (pendingTicket && !pendingTicket.isPending) history.push(`/lotteries/${lotteryName}/buy/details/${pendingId}`);
	}, [pendingId, history, lotteryName, pendingTicket]);

	if (!pendingTicket) return null;
	
	const ticketPrice = Web3Utils.fromWei(pendingTicket.ticketValue.toString(), 'ether');
	const Logo = LOTTERY_LOGOS[lotteryName];

	return (
		<PendingPurchaseContainer>
			<LargeText>{t('waiting_for_a_payment')}</LargeText>
			<RotatingTrianglesLoader />
			<TicketInfoWrapper>
				<TopRow>
					<TicketTitle>
						{t('ticket')}
					</TicketTitle>
					<TimeDrawWrapper>
						<MediumText>
							{t('draw_number')}{pendingTicket?.ticketLotteryId}
						</MediumText>
						<MediumText>
							{unixToDate(pendingTicket.drawTime, i18n.language)}
						</MediumText>
					</TimeDrawWrapper>
				</TopRow>
				<LogoWrapper>
					<Logo />
				</LogoWrapper>
				<NumbersLarge
					lotteryName={lotteryName}
					numFieldOne={pendingTicket.pickedNumbers}
					numFieldTwo={pendingTicket.pickedNumbersSecondField}
				/>
				<LargeText>
					{t('ticket_price')}: {ticketPrice} {currency}
				</LargeText>
			</TicketInfoWrapper>
			<LargeTextSecondary>{t('please_confirm_transaction')}</LargeTextSecondary>
		</PendingPurchaseContainer>
	);
};

export default PurchasePending;
