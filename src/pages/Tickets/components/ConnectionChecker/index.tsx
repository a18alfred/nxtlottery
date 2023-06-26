import React from 'react';
import { selectUserConnectionStatus } from '../../../../state/user/slice';
import NoConnection from '../NoConnection';
import { useAppSelector } from '../../../../state/hooks';
import { WithChildren } from '../../../../constants/types';

const ConnectionChecker: React.FC<WithChildren> = ({ children }) => {
	const connected = useAppSelector(selectUserConnectionStatus);

	if (!connected) return (<NoConnection />);
	return (
		<>
			{children}
		</>
	);
};

export default ConnectionChecker;
