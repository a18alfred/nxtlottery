import React from 'react';
import { selectTicketLoadingState } from '../../../../state/ticket/slice';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import { useAppSelector } from '../../../../state/hooks';

const TicketsLoader = () => {
	const isLoading = useAppSelector(selectTicketLoadingState);

	if (isLoading) return <RotatingTrianglesLoader />;

	return null;
};

export default TicketsLoader;
