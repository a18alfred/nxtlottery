import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { LOTTERY_NAMES } from '../../constants/settings';
import LotteryElement from './components/LotteryElement';
import LotteryBanner from './components/LotteryBanner';
import { bottomMarginGeneral } from '../../context/theme/style';

const LotteriesContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: ${bottomMarginGeneral};

  @media screen and (max-width: 880px) {
    margin-top: 0;
  }
`;

const LotteriesWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;

  @media screen and (max-width: 880px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Lotteries = () => {
	const lotteryElements: ReactNode[] = [];

	lotteryElements.push(
		<LotteryBanner key={lotteryElements.length} />
	);
	for (let key in LOTTERY_NAMES) {
		lotteryElements.push(
			<LotteryElement key={lotteryElements.length} lotteryName={LOTTERY_NAMES[key]} />
		);
	}

	return (
		<LotteriesContainer>
			<LotteriesWrapper>
				{lotteryElements}
			</LotteriesWrapper>
		</LotteriesContainer>
	);
};

export default Lotteries;