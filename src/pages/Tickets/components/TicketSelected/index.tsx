import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { selectTicketsArray } from '../../../../state/ticket/slice';
import styled from 'styled-components';
import { text } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import TicketDetails from '../TicketDetails';
import { useAppSelector } from '../../../../state/hooks';
import { BackButton } from '../../../../components/Button';

const TicketDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopControl = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 1rem;
`;

const BackHeader = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
`;

const TicketSelected = () => {
	const { t } = useTranslation();
	const { ticketId } = useParams<{ ticketId: string }>();
	const tickets = useAppSelector(selectTicketsArray);
	const ticket = tickets.find(ticket => ticket.ticketId === parseInt(ticketId));
	const history = useHistory();

	useEffect(() => {
		if (!ticket) {
			history.push('/tickets');
		}
	}, [ticket, history]);

	if (!ticket) return null;

	return (
		<TicketDetailsContainer>
			<TopControl>
				<BackButton />
				<BackHeader>
					{t('my_tickets')}
				</BackHeader>
			</TopControl>
			<TicketDetails ticket={ticket} />
		</TicketDetailsContainer>
	);
};

export default TicketSelected;
