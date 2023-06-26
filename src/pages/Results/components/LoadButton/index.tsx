import React, { MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import useLotteryFetch from '../../../../hooks/useLotteryFetch';
import { useTranslation } from 'react-i18next';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import { selectLotteryIsLoading, selectLotteryLastIdLoaded } from '../../../../state/lottery/slice';
import { TicketButton } from '../../../../components/Button';
import { lotteryColorBtn } from '../../../../constants/colors';
import { useAppSelector } from '../../../../state/hooks';
import { RouteParamLotteryName } from '../../../../constants/types';

const LoadButton = () => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const lotteryBtnBg = lotteryColorBtn[lotteryName];
	const isLoading = useAppSelector(state => selectLotteryIsLoading(state, lotteryName));
	const lastIdLoaded = useAppSelector(state => selectLotteryLastIdLoaded(state, lotteryName));
	const { resultsFetchMore } = useLotteryFetch(lotteryName);
	const { t } = useTranslation();

	const onLoadMore = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		resultsFetchMore();
	};

	if (lastIdLoaded === 1) return null;

	return (
		<>
			{
				isLoading
					? <RotatingTrianglesLoader />
					: <>
						<TicketButton marginTB={'1rem'} bgColor={lotteryBtnBg} onClick={onLoadMore}>
							{t('load_more')}
						</TicketButton>
					</>
			}
		</>
	);
};

export default LoadButton;
