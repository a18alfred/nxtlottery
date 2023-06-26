import { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { WithChildren } from '../../constants/types';

interface Props extends RouteComponentProps, WithChildren {
}

const ScrollToTop = ({ history, children }: Props) => {
	useEffect(() => {
		const unListen = history.listen(() => {
			window.scrollTo(0, 0);
		});
		return () => {
			unListen();
		};
	}, [history]);

	return <>{children}</>;
};

export default withRouter(ScrollToTop);