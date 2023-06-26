import { MouseEvent } from 'react';
import styled from 'styled-components';
import { LOTTERY_LOGOS, LOTTERY_SETTINGS } from '../../../../constants/settings';
import { selectLotteryByName } from '../../../../state/lottery/slice';
import {
	cardBgColor, lotteryColorBtn,
	secondaryText,
	text
} from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import Web3Utils from 'web3-utils';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import { useHistory } from 'react-router-dom';
import { selectCurrency } from '../../../../state/user/slice';
import DrawTimeElement from '../../../../components/DrawTimeElement';
import { TicketButton } from '../../../../components/Button';
import { useAppSelector } from '../../../../state/hooks';
import { LotteryNameType } from '../../../../constants/types';

const LotteryElementWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;

  background: ${cardBgColor};
  padding: 1.5rem;
  border-radius: 16px;
`;

export const JackpotLine = styled.h2`
  color: ${text};
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;

  @media screen and (max-width: 880px) {
    text-align: center;
  }
`;

const LotteryName = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;

  @media screen and (max-width: 450px) {
    font-size: 1.7rem;
  }
`;

const LogoWrapper = styled.div`
  margin-bottom: 1rem;

  svg {
    width: 100%;
    height: 5rem;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const LoaderWrapper = styled.div`
  margin-bottom: 0.15rem;
`;

const InfoRow = styled.p`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: ${secondaryText};
  margin-top: 1em;
`;

interface LotteryElementProps {
	lotteryName: LotteryNameType;
}

const LotteryElement = ({ lotteryName }: LotteryElementProps) => {
	const history = useHistory();
	const defaultData = LOTTERY_SETTINGS[lotteryName];
	const lotteryData = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const { t } = useTranslation();
	const Logo = LOTTERY_LOGOS[lotteryName];
	const lotteryBtnBg = lotteryColorBtn[lotteryName];
	const name = t(lotteryName);
	const currency = useAppSelector(selectCurrency);

	const currentId = lotteryData.currentId;
	const jackpot = currentId === 0 ? defaultData.initialJackpot.toString()
		: Web3Utils.fromWei(lotteryData.draws[currentId]?.jackpot.toString(), 'ether');
	const drawTime = lotteryData.draws[currentId]?.drawTime;
	const ticketPrice = currentId === 0 ? defaultData.minimumPrice
		: Web3Utils.fromWei(lotteryData.draws[currentId]?.minimumPrice.toString(), 'ether');

	const onLotteryClick = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		history.push(`lotteries/${lotteryName}/buy`);
	};

	return (
		<LotteryElementWrapper onClick={onLotteryClick}>
			<LogoWrapper>
				<Logo />
			</LogoWrapper>
			<LotteryName>
				{name}
			</LotteryName>
			<JackpotLine>
				{t('jackpot')} {jackpot} {currency}
			</JackpotLine>
			{currentId !== 0
				? <InfoWrapper>
					<InfoRow>
						{t('draw_number')}{currentId}
					</InfoRow>
					<InfoRow>
						<DrawTimeElement
							drawTime={drawTime}
							lotteryName={lotteryName}
							reFetch={true}
						/>
					</InfoRow>
				</InfoWrapper>
				: <LoaderWrapper>
					<RotatingTrianglesLoader />
				</LoaderWrapper>
			}
			<TicketButton bgColor={lotteryBtnBg}>
				{t('ticket_price')} {ticketPrice} {currency}
			</TicketButton>
		</LotteryElementWrapper>
	);
};

export default LotteryElement;
