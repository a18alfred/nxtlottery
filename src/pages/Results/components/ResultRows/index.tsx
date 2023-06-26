import React from 'react';
import { useParams } from 'react-router-dom';
import { getFilledArrayDesc } from '../../../../utils/helpers';
import { selectLotteryByName } from '../../../../state/lottery/slice';
import DrawInfo from '../DrawInfo';
import styled from 'styled-components';
import { useAppSelector } from '../../../../state/hooks';
import { RouteParamLotteryName } from '../../../../constants/types';

const ResultRowsWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

const ResultRows = () => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const lotteryData = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const arrayOfKeys = getFilledArrayDesc(lotteryData.lastIdLoaded, lotteryData.currentId - 1);

	return (
		<ResultRowsWrapper>
			{
				arrayOfKeys.map((key) => {
					if (!lotteryData.draws[key]) return null;
					return <DrawInfo
						key={key}
						draw={lotteryData.draws[key]}
					/>;
				})
			}
		</ResultRowsWrapper>
	);
};

export default ResultRows;
