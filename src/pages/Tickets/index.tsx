import React from 'react';
import styled from 'styled-components';
import ConnectionChecker from './components/ConnectionChecker';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import UserTickets from './components/UserTickets';
import TicketSelected from './components/TicketSelected';
import { bottomNavHeight } from '../../context/theme/style';

const TicketsContainer = styled.div`
  margin-bottom: ${bottomNavHeight};
`;

const Tickets = () => {
	const { path } = useRouteMatch();

	return (
		<TicketsContainer>
			<ConnectionChecker>
				<Switch>
					<Route exact path={path}>
						<UserTickets />
					</Route>
					<Route path={`${path}/:ticketId`}>
						<TicketSelected />
					</Route>
				</Switch>
			</ConnectionChecker>
		</TicketsContainer>
	);
};

export default Tickets;
