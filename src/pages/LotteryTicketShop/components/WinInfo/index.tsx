import { ReactNode, memo } from 'react';
import styled from 'styled-components';
import { cardBgColor, secondaryText, text } from '../../../../constants/colors';
import { LOTTERY_SETTINGS, WIN_NFO_IMAGE } from '../../../../constants/settings';
import { useTranslation } from 'react-i18next';
import Web3Utils from 'web3-utils';
import { multdec } from '../../../../utils/helpers';
import { selectLotteryByName } from '../../../../state/lottery/slice';
import { selectCurrency } from '../../../../state/user/slice';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../state/hooks';
import { RouteParamLotteryName } from '../../../../constants/types';

const WinInfoContainer = styled.div`
  border-radius: 16px;
  padding: 1.5rem;
  background: ${cardBgColor};
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 1.5rem;
  align-items: flex-start;
  padding-right: 1rem;

  @media screen and (max-width: 880px) {
    grid-template-columns: 1fr;
    padding-right: 0;
  }
`;

const InfoSectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 1rem;
  color: ${secondaryText};
  font-size: 16px;
  font-weight: 600;
`;

const InfoSectionTitleLeft = styled.p`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
`;

const InfoSectionTitleRight = styled.p`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
  text-align: right;
`;

const InfoSectionTextLeft = styled.p`
`;

const InfoSectionTextRight = styled.p`
  text-align: right;
`;

const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;

  @media screen and (max-width: 880px) {
    text-align: center;
  }
`;

const WinnerImgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    max-height: 20rem;
  }
`;

const WinInfo = memo(() => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const lotteryData = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const currency = useAppSelector(selectCurrency);
	const settings = LOTTERY_SETTINGS[lotteryName];
	const WinInfoPic = WIN_NFO_IMAGE[lotteryName];
	const { t } = useTranslation();
	const winInfoElements: ReactNode[] = [];
	const currentId = lotteryData.currentId;

	const minPrice = +Web3Utils.fromWei(lotteryData.draws[currentId].minimumPrice.toString(), 'ether');

	if (settings.secondField === null)
		for (let index = settings.minToWin; index <= settings.matchedToWinJackpot; index++) {
			const multiplier = settings.prizeMultipliers[index];
			let message = '';
			if (index === settings.matchedToWinJackpot) message = t('jackpot');
			else message = multdec(minPrice, multiplier).toString() + ` ${currency}`;
			winInfoElements.push(
				<InfoSectionTextLeft key={index}>
					{index}
				</InfoSectionTextLeft>
			);
			winInfoElements.push(
				<InfoSectionTextRight key={settings.maxNumber + index}>
					{message}
				</InfoSectionTextRight>
			);
		}

	if (settings.secondField !== null) {
		let key = 0;
		for (let index = settings.minToWin; index <= settings.matchedToWinJackpot; index++) {
			for (let i = 0; i <= index; i++) {
				const multiplier = settings.prizeMultipliersTwoFields[index][i];
				let message = '';
				if (index === settings.matchedToWinJackpot && i === settings.matchedToWinJackpot) message = t('jackpot');
				else message = multdec(minPrice, multiplier).toString() + ` ${currency}`;

				let guessed = '';
				if (index === i) guessed = `${index} X ${i}`;
				else guessed = `${index} X ${i} (${i} X ${index})`;

				winInfoElements.push(
					<InfoSectionTextLeft key={key}>
						{guessed}
					</InfoSectionTextLeft>
				);
				key++;
				winInfoElements.push(
					<InfoSectionTextRight key={key}>
						{message}
					</InfoSectionTextRight>
				);
				key++;
			}
		}
	}

	return (
		<WinInfoContainer>
			<HeaderTitle>
				{t('what_can_you_win')}
			</HeaderTitle>
			<ContentWrapper>
				<WinnerImgWrapper>
					<WinInfoPic />
				</WinnerImgWrapper>
				<InfoSectionWrapper>
					<InfoSectionTitleLeft>
						{t('numbers_guessed')}
					</InfoSectionTitleLeft>
					<InfoSectionTitleRight>
						{t('winning_amount')}
					</InfoSectionTitleRight>
					{winInfoElements}
				</InfoSectionWrapper>
			</ContentWrapper>
		</WinInfoContainer>
	);
});

export default WinInfo;
