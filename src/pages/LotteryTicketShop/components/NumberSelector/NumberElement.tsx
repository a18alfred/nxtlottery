import { MouseEvent } from 'react';
import styled from 'styled-components';
import { backgroundColor, text, textInverted } from '../../../../constants/colors';

interface NumberWrapperProps {
	isSelected: boolean;
	bgColor: string;
	bgHoverColor: string;
}

const NumberWrapper = styled.div<NumberWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  outline: none;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 800;
  background: ${({ isSelected, bgColor }) => (isSelected ? bgColor : backgroundColor)};
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? textInverted : text)};

  @media screen and (max-width: 410px) {
    height: 2.7rem;
    width: 2.7rem;
    font-size: 24px;
  }

  @media screen and (max-width: 376px) {
    height: 2.5rem;
    width: 2.5rem;
    font-size: 24px;
  }

  @media (hover: hover) {
    :hover {
      background-color: ${({ isSelected, bgColor, bgHoverColor }) => (isSelected ? bgColor : bgHoverColor)};
      color: ${textInverted}
    }
  }
`;

interface NumberElementProps {
	number: number;
	bgColor: string;
	bgHoverColor: string;
	selectHandler: (number: number) => void;
	isSelected: boolean;
}

const NumberElement = ({ number, selectHandler, bgColor, bgHoverColor, isSelected }: NumberElementProps) => {
	const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		selectHandler(number);
	};
	return (
		<NumberWrapper
			bgColor={bgColor}
			bgHoverColor={bgHoverColor}
			isSelected={isSelected}
			onClick={clickHandler}
		>
			{number}
		</NumberWrapper>
	);
};

export default NumberElement;
