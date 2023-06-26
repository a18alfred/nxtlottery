import React from 'react';
import styled from 'styled-components';
import AdminMain from './components/AdminMain';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdminLotteries from './components/AdminLotteries';
import AdminGovernance from './components/AdminGovernance';
import AdminRandomness from './components/AdminRandomness';
import { selectUser } from '../../state/user/slice';
import { useWeb3 } from '../../context/web3/web3';
import { useAppSelector } from '../../state/hooks';

const AdminPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const AdminPanel = () => {
	const { path } = useRouteMatch();
	const user = useAppSelector(selectUser);
	const { governanceInstance } = useWeb3();

	if (!user.connected || governanceInstance.current === null) return null;

	return (
		<AdminPanelContainer>
			<Switch>
				<Route exact path={path}>
					<AdminMain />
				</Route>
				<Route path={`${path}/lotteries`}>
					<AdminLotteries />
				</Route>
				<Route path={`${path}/governance`}>
					<AdminGovernance />
				</Route>
				<Route path={`${path}/randomness`}>
					<AdminRandomness />
				</Route>
			</Switch>
		</AdminPanelContainer>
	);
};

export default AdminPanel;
