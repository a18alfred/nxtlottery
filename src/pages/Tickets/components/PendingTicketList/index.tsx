import React, { ReactNode } from 'react';
import { selectPendingTickets } from '../../../../state/ticket/slice';
import Ticket from '../Ticket';
import { useAppSelector } from '../../../../state/hooks';

const PendingTicketList = () => {
	const pendingTickets = useAppSelector(selectPendingTickets);
	const pendingTicketsKeys = Object.keys(pendingTickets);

	const pendingTicketElements: ReactNode[] = [];

	for (let index = pendingTicketsKeys.length - 1; index >= 0; index--) {
		const id = parseInt(pendingTicketsKeys[index]);
		if (pendingTickets[id].isPending)
			pendingTicketElements.push(
				<Ticket
					key={id}
					ticket={pendingTickets[id]}
					isPending={true}
				/>
			);
	}

	return (
		<>
			{pendingTicketElements}
		</>
	);
};

export default PendingTicketList;
