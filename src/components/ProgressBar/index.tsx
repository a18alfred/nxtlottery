import React from 'react';
import styled from 'styled-components';
import { backgroundColor, secondaryText } from '../../constants/colors';

interface ProgressBarProps {
	percentage: number;
	lineColor: string;
}

const ProgressBarWrapper = styled.div`
  border-radius: 30px;
  background-color: ${backgroundColor};
  width: 100%;
`;

const ProgressLine = styled.div.attrs((props: ProgressBarProps) => ({
	lineColor: props.lineColor || secondaryText,
	percentage: props.percentage || 0
}))`
  height: 10px;
  border-radius: 30px;
  transition: 0.2s ease-in-out;
  transition-property: width;
  background: ${(props) => props.lineColor};
  width: ${(props) => props.percentage}%;
`;

const ProgressBar = ({ percentage, lineColor }: ProgressBarProps) => {
	return (
		<ProgressBarWrapper>
			<ProgressLine percentage={percentage} lineColor={lineColor} />
		</ProgressBarWrapper>
	);
};

export default ProgressBar;
