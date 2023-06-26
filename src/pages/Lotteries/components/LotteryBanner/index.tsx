import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { cardBgColor } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { LOTTERY_NAMES, TRY_YOUR_LUCK_BANNER } from '../../../../constants/settings';
import { getRandomObjectProperty } from '../../../../utils/helpers';
import { useHistory } from 'react-router-dom';

const BannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
  padding: 4rem;
  border-radius: 16px;
  cursor: pointer;
  background: ${cardBgColor};
  transition: padding 1s ease-in-out;

  svg {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 880px) {
    transition: padding 1s ease-in-out;
    padding: 6rem;
  }

  @media screen and (max-width: 650px) {
    transition: padding 1s ease-in-out;
    padding: 1.5rem;
  }
`;

const LotteryBanner = () => {
	const { i18n } = useTranslation();
	const Banner = TRY_YOUR_LUCK_BANNER[i18n.language];
	const lotteryName = getRandomObjectProperty(LOTTERY_NAMES);
	const history = useHistory();

	const onTryYourLuck = (e: MouseEvent<SVGSVGElement>) => {
		e.preventDefault();
		history.push(`/lotteries/${lotteryName}/buy?random=true`);
	};

	return (
		<BannerWrapper>
			<Banner onClick={onTryYourLuck} />
		</BannerWrapper>
	);
};

export default LotteryBanner;
