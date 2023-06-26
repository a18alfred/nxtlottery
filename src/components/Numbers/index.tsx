import { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { backgroundColor, lotteryNumbersBg, text } from '../../constants/colors';
import { LOTTERY_SETTINGS } from '../../constants/settings';
import { LotteryNameType } from '../../constants/types';

const NumbersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1rem;

  @media screen and (max-width: 625px) {
    gap: clamp(0.5rem, -0.1792rem + 3.0189vw, 1rem);
  }
`;

interface NumberProps {
	twoFields: boolean;
	isMatched: boolean;
	activeColor: string;
}

const Number = styled.span<NumberProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ twoFields }) => twoFields ? `clamp(1rem, -0.1887rem + 5.283vw, 1.875rem)` : `clamp(1.125rem, 0.1061rem + 4.5283vw, 1.875rem)`};
  font-weight: 800;
  height: ${({ twoFields }) => twoFields ? `clamp(1.65rem, -0.0765rem + 7.6735vw, 4rem)` : `clamp(2rem, -0.2857rem + 10.1587vw, 4rem)`};
  width: ${({ twoFields }) => twoFields ? `clamp(1.65rem, -0.0765rem + 7.6735vw, 4rem)` : `clamp(2rem, -0.2857rem + 10.1587vw, 4rem)`};
  outline: none;
  border-radius: 16px;
  background: ${backgroundColor};
  color: ${({ isMatched, activeColor }) => isMatched ? activeColor : text};

  @media screen and (max-width: 625px) {
    border-radius: clamp(0.5rem, -0.1792rem + 3.0189vw, 1rem);
  }
`;

const EmptySquare = styled.span`
  width: 0.25rem;
  @media screen and (max-width: 625px) {
    width: clamp(0.25rem, -0.0896rem + 1.5094vw, 0.5rem);
  }
`;

interface NumbersRegularProps {
	numFieldOne: number[];
	numFieldTwo: number[];
	numToMatchFieldOne: number[];
	numToMatchFieldTwo: number[];
	lotteryName: LotteryNameType;
}

const NumbersRegular = memo(({
								 numFieldOne,
								 numFieldTwo,
								 numToMatchFieldOne,
								 numToMatchFieldTwo,
								 lotteryName
							 }: NumbersRegularProps) => {
	const numberElements: ReactNode[] = [];
	const settings = LOTTERY_SETTINGS[lotteryName];
	const numbersBg = lotteryNumbersBg[lotteryName];

	for (let i = 0; i < numFieldOne.length; i++) {
		let isMatched = false;
		if (numToMatchFieldOne.length !== 0)
			isMatched = numToMatchFieldOne.includes(numFieldOne[i]);
		numberElements.push(
			<Number
				twoFields={!!settings.secondField}
				key={numberElements.length}
				isMatched={isMatched}
				activeColor={numbersBg}
			>
				{('0' + numFieldOne[i]).slice(-2)}
			</Number>
		);
	}

	if (settings.secondField) {
		numberElements.push(
			<EmptySquare key={'|'} />
		);

		for (let i = 0; i < numFieldTwo.length; i++) {
			let isMatched = false;
			if (numToMatchFieldTwo.length !== 0)
				isMatched = numToMatchFieldTwo.includes(numFieldTwo[i]);
			numberElements.push(
				<Number
					twoFields={!!settings.secondField}
					key={numberElements.length}
					isMatched={isMatched}
					activeColor={numbersBg}
				>
					{('0' + numFieldTwo[i]).slice(-2)}
				</Number>
			);
		}
	}

	return (
		<NumbersWrapper>
			{numberElements}
		</NumbersWrapper>
	);
});

export default NumbersRegular;
