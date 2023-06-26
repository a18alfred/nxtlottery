import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { NumbersField, RouteParamLotteryName } from '../../../../constants/types';
import { LOTTERY_SETTINGS } from '../../../../constants/settings';
import NumberElement from './NumberElement';
import { lotteryNumbersBg, lotteryNumbersHoverBg } from '../../../../constants/colors';
import styled from 'styled-components';


interface NumberSelectorProps {
	isSecondField: boolean;
	selectHandler: (number: number) => void;
	numbersFields: NumbersField;
}

const NumberSelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;

  @media screen and (max-width: 512px) {
    gap: 0.5rem;
  }
`;

const NumberSelector = ({ isSecondField, selectHandler, numbersFields }: NumberSelectorProps) => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const settings = LOTTERY_SETTINGS[lotteryName];
	const minNumber = isSecondField ? settings.secondField?.minNumber : settings.minNumber;
	const maxNumber = isSecondField ? settings.secondField?.maxNumber : settings.maxNumber;
	if (!minNumber || !maxNumber) return null;
	const numbersBg = lotteryNumbersBg[lotteryName];
	const numbersHoverBg = lotteryNumbersHoverBg[lotteryName];
	const selectedNumbers = isSecondField ? numbersFields.field2.numbers : numbersFields.field1.numbers;

	const numberElements: ReactNode[] = [];

	for (let index = minNumber; index <= maxNumber; index++) {
		numberElements.push(
			<NumberElement
				key={index}
				number={index}
				bgColor={numbersBg}
				bgHoverColor={numbersHoverBg}
				selectHandler={selectHandler}
				isSelected={selectedNumbers.some(item => item === index)}
			/>
		);
	}

	return (
		<NumberSelectorWrapper>
			{numberElements}
		</NumberSelectorWrapper>
	);
};

export default NumberSelector;
