import styled from 'styled-components';
import TicketPicker from '../TIcketPicker';
import { LOTTERY_LOGOS, GLOBAL_SETTINGS } from '../../../../constants/settings';
import { useTranslation } from 'react-i18next';
import { selectLotteryByName } from '../../../../state/lottery/slice';
import {
	text,
	secondaryText
} from '../../../../constants/colors';
import Web3Utils from 'web3-utils';
import { selectCurrency } from '../../../../state/user/slice';
import DrawTimeElement from '../../../../components/DrawTimeElement';
import SalesClose from '../SalesClose';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import { bottomMarginGeneral } from '../../../../context/theme/style';
import { useAppSelector } from '../../../../state/hooks';
import { BackButton } from '../../../../components/Button';
import { useParams } from 'react-router-dom';
import { RouteParamLotteryName } from '../../../../constants/types';

const TicketShopContainer = styled.div`
  margin-bottom: ${bottomMarginGeneral};
  display: flex;
  flex-direction: column;
`;

const LotteryInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  margin-bottom: 1rem;
  gap: 1rem;

  @media screen and (max-width: 880px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const NameAndLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  svg {
    height: 3rem;
    width: auto;
  }
`;

const JackPotInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;

  @media screen and (max-width: 880px) {
    align-items: flex-start;
    margin-top: 1rem;
  }
`;

const Name = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
  margin-left: 1rem;

  @media screen and (max-width: 420px) {
    font-size: 16px;
  }
`;

const JackPot = styled.p`
  font-size: 1rem;
  font-weight: 800;
  color: ${text};
`;

const Info = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${secondaryText};
  margin: 0.5rem 0;
`;

const InfoSpan = styled.span`
  margin-left: 0.5rem;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const TicketShop = () => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const { t } = useTranslation();
	const Logo = LOTTERY_LOGOS[lotteryName];
	const name = t(lotteryName);
	const lotteryData = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const currency = useAppSelector(selectCurrency);

	if (!lotteryData.isCurrentLoaded) return (
		<LoaderWrapper>
			<RotatingTrianglesLoader />
		</LoaderWrapper>
	);

	const currentId = lotteryData.currentId;
	const jackpot = Web3Utils.fromWei(lotteryData.draws[currentId].jackpot, 'ether');
	const drawTime = lotteryData.draws[currentId].drawTime;
	const timeDifference = lotteryData.draws[currentId].drawTime - Math.round((new Date()).getTime() / 1000);

	return (
		<TicketShopContainer>
			<LotteryInfo>
				<NameAndLogoWrapper>
					<BackButton to='/lotteries' />
					<Logo />
					<Name>
						{name}
					</Name>
				</NameAndLogoWrapper>
				<JackPotInfoWrapper>
					<JackPot>
						{t('jackpot')} {jackpot} {currency}
					</JackPot>
					<Info>
						{t('draw_number')}{currentId}
						<InfoSpan>·</InfoSpan>
						<InfoSpan>
							<DrawTimeElement drawTime={drawTime} lotteryName={lotteryName} reFetch={true} />
						</InfoSpan>
					</Info>
				</JackPotInfoWrapper>
			</LotteryInfo>
			{
				timeDifference <= GLOBAL_SETTINGS.closedSaleTimeInSeconds
					? <SalesClose />
					: <TicketPicker />
			}
		</TicketShopContainer>
	);
};

export default TicketShop;
