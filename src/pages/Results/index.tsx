import React from 'react';
import styled from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ResultsSelector from './components/ResultsSelector';
import ResultsByLottery from './components/ResultsByLottery';
import { bottomMarginGeneral } from '../../context/theme/style';

const ResultsContainer = styled.div`
  margin-bottom: ${bottomMarginGeneral};
`;

const Results = () => {
	const { path } = useRouteMatch();

	return (
		<ResultsContainer>
			<Switch>
				<Route exact path={path}>
					<ResultsSelector />
				</Route>
				<Route path={`${path}/:lotteryName`}>
					<ResultsByLottery />
				</Route>
			</Switch>
		</ResultsContainer>
	);
};

export default Results;


