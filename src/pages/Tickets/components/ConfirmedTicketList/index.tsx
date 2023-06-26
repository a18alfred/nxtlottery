import React from 'react';
import {
	selectTicketFirstFetchState,
	selectTicketsArray,
	selectTicketTotal
} from '../../../../state/ticket/slice';
import Ticket from '../Ticket';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { secondaryText } from '../../../../constants/colors';
import { useAppSelector } from '../../../../state/hooks';

const EmptyList = styled.li`
  width: 100%;
  text-align: center;
  color: ${secondaryText};
`;

const ConfirmedTicketList = () => {
	const { t } = useTranslation();
	const tickets = useAppSelector(selectTicketsArray);
	const isFetched = useAppSelector(selectTicketFirstFetchState);
	const total = useAppSelector(selectTicketTotal);
	const ticketElements = [];

	for (let ticket of tickets) {
		ticketElements.push(
			<Ticket
				key={ticket.ticketId}
				ticket={ticket}
				isPending={false}
			/>
		);
	}

	if (isFetched && total === 0) return (
		<EmptyList>
			{t('no_tickets')}
		</EmptyList>
	);

	return (
		<>
			{ticketElements}
		</>
	);
};

export default ConfirmedTicketList;
