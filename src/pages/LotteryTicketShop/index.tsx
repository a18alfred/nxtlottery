import React, { useEffect } from 'react';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import TicketShop from './components/TicketShop';
import { LOTTERY_LOGOS } from '../../constants/settings';
import PurchasePending from './components/PurchasePending';
import PurchaseResult from './components/PurchaseResult';
import { RouteParamLotteryName } from '../../constants/types';

const LotteryTicketShop = () => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const { path } = useRouteMatch();
	const history = useHistory();

	useEffect(() => {
		if (!LOTTERY_LOGOS[lotteryName]) history.push('/');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!LOTTERY_LOGOS[lotteryName]) return null;

	return (
		<Switch>
			<Route exact path={path}>
				<TicketShop />
			</Route>
			<Route path={`${path}/pending/:pendingId`}>
				<PurchasePending />
			</Route>
			<Route path={`${path}/details/:pendingId`}>
				<PurchaseResult />
			</Route>
		</Switch>
	)
		;
};

export default LotteryTicketShop;
