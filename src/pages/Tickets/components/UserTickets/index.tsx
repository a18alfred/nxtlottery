import React from 'react';
import styled from 'styled-components';
import { text } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import ConfirmedTicketList from '../ConfirmedTicketList';
import PendingTicketList from '../PendingTicketList';
import InfiniteListLoader from '../InfiniteListLoader';
import TicketsLoader from '../TicketsLoader';
import UpdateButton from '../UpdateButton';

const UserTicketsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoaderWrapper = styled.li`
  margin: -1rem 0;
`;

const TopRow = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Header = styled.h2`
  width: 100%;
  text-align: left;
  color: ${text};
  font-weight: 800;
  font-size: 24px;
`;

const UserTickets = () => {
	const { t } = useTranslation();

	return (
		<UserTicketsContainer>
			<TopRow>
				<Header>
					{t('my_tickets')}
				</Header>
				<UpdateButton />
			</TopRow>
			<PendingTicketList />
			<ConfirmedTicketList />
			<LoaderWrapper>
				<TicketsLoader />
			</LoaderWrapper>
			<InfiniteListLoader />
		</UserTicketsContainer>
	);
};

export default UserTickets;
