import React from 'react';
import { useParams } from 'react-router-dom';
import { selectLotteryCurrentIdByName, selectLotteryIsCurrentLoaded } from '../../../../state/lottery/slice';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import NoDraws from '../NoDraws';
import { useAppSelector } from '../../../../state/hooks';
import { RouteParamLotteryName, WithChildren } from '../../../../constants/types';

const CurrentLoader: React.FC<WithChildren> = ({ children }) => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const currentId = useAppSelector(state => selectLotteryCurrentIdByName(state, lotteryName));
	const isCurrentLoaded = useAppSelector(state => selectLotteryIsCurrentLoaded(state, lotteryName));

	if (!isCurrentLoaded) return (<RotatingTrianglesLoader />);
	if (currentId <= 1) return (<NoDraws />);

	return (
		<>
			{children}
		</>
	);
};

export default CurrentLoader;
