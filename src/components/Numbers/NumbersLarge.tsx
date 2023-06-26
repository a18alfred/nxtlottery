import { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { backgroundColor } from '../../constants/colors';
import { LOTTERY_SETTINGS } from '../../constants/settings';
import { LotteryNameType } from '../../constants/types';

const NumbersBigWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;

  @media screen and (max-width: 880px) {
    gap: 0.5rem;
  }
`;

export interface NumberProps {
	twoFields: boolean;
}

const Number = styled.span<NumberProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ twoFields }) => twoFields ? `clamp(1rem, -0.1364rem + 4.8485vw, 3.5rem)` : `clamp(1.125rem, 0.1071rem + 4.5238vw, 3.5rem)`};
  font-weight: 800;
  height: ${({ twoFields }) => twoFields ? `clamp(1.6rem, -0.6273rem + 9.503vw, 6.5rem)` : `clamp(2rem, -0.5714rem + 11.4286vw, 8rem)`};
  width: ${({ twoFields }) => twoFields ? `clamp(1.6rem, -0.6273rem + 9.503vw, 6.5rem)` : `clamp(2rem, -0.5714rem + 11.4286vw, 8rem)`};
  outline: none;
  border-radius: 16px;
  background: ${backgroundColor};

  @media screen and (max-width: 880px) {
    border-radius: clamp(0.4375rem, 0.0481rem + 1.7308vw, 1rem);
  }
`;

const EmptySquare = styled.span`
  width: 1rem;
  @media screen and (max-width: 880px) {
    width: 0.5rem;
  }
`;

interface NumbersHugeProps {
	numFieldOne: number[];
	numFieldTwo: number[];
	lotteryName: LotteryNameType;
}

const NumbersLarge = memo(({ numFieldOne, numFieldTwo, lotteryName }: NumbersHugeProps) => {
	const numberElements: ReactNode[] = [];
	const settings = LOTTERY_SETTINGS[lotteryName];

	for (let i = 0; i < numFieldOne.length; i++) {
		numberElements.push(
			<Number twoFields={!!settings.secondField} key={numberElements.length}>
				{('0' + numFieldOne[i]).slice(-2)}
			</Number>
		);
	}

	if (settings.secondField) {
		numberElements.push(
			<EmptySquare key={'|'}>

			</EmptySquare>
		);
		for (let i = 0; i < numFieldTwo.length; i++) {
			numberElements.push(
				<Number twoFields={!!settings.secondField} key={numberElements.length}>
					{('0' + numFieldTwo[i]).slice(-2)}
				</Number>
			);
		}
	}

	return (
		<NumbersBigWrapper>
			{numberElements}
		</NumbersBigWrapper>
	);
});

export default NumbersLarge;
