import { selectUser } from '../../state/user/slice';
import {
	Route,
	Redirect
} from 'react-router-dom';
import { useAppSelector } from '../../state/hooks';
import React from 'react';
import { WithChildren } from '../../constants/types';

interface PrivateRouteProps extends WithChildren {
	path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
	const { isAdmin } = useAppSelector(selectUser);

	return (
		<Route
			{...rest}
			render={({ location }) =>
				isAdmin ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/',
							state: { from: location }
						}}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;
