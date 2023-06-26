import React from 'react';
import styled from 'styled-components';
import { LOTTERY_LOGOS, LOTTERY_NAMES } from '../../constants/settings';
import { cardBgColor } from '../../constants/colors';
import { useTranslation } from 'react-i18next';
import { LotteryNameType } from '../../constants/types';

const LotterySelectorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  gap: 1rem;
`;

const LotteryElement = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  cursor: pointer;
  gap: 2rem;
  font-weight: 800;
  font-size: 32px;
  background: ${cardBgColor};
  padding: 1.5rem;
  border-radius: 16px;

  svg {
    height: 6rem;
    width: auto;
  }

  @media screen and (max-width: 880px) {
    font-size: clamp(1.5rem, 1.1538rem + 1.5385vw, 2rem);
    flex-direction: column;
  }
`;

interface LotterySelectorProps {
	onSelected: ({ lotteryName }: { lotteryName: LotteryNameType }) => void;
}

const LotterySelector = ({ onSelected }: LotterySelectorProps) => {
	const lotteryElements = [];
	const { t } = useTranslation();

	for (let key in LOTTERY_NAMES) {
		const lotteryName = LOTTERY_NAMES[key];
		const Logo = LOTTERY_LOGOS[lotteryName];
		lotteryElements.push(
			<LotteryElement key={key} onClick={e => {
				e.preventDefault();
				onSelected({ lotteryName: lotteryName });
			}}>
				<Logo />
				{t(lotteryName)}
			</LotteryElement>
		);
	}
	return (
		<LotterySelectorContainer>
			{lotteryElements}
		</LotterySelectorContainer>
	);
};

export default LotterySelector;
