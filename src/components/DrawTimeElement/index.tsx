import React, { Fragment, useEffect, useRef, useState } from 'react';
import { unixToDate } from '../../utils/helpers';
import ReactTimeAgo from 'react-time-ago';
import { useTranslation } from 'react-i18next';
import { GLOBAL_SETTINGS } from '../../constants/settings';
import useLotteryUpdate from '../../hooks/useLotteryUpdate';
import { LotteryNameType } from '../../constants/types';

interface DrawTimeElementProps {
	drawTime: number,
	lotteryName: LotteryNameType,
	reFetch: boolean
}

const DrawTimeElement = ({ drawTime, lotteryName, reFetch }: DrawTimeElementProps) => {
	let timeDifference = drawTime - Math.round((new Date()).getTime() / 1000);
	const [drawInProgress, setDrawInProgress] = useState<boolean>(false);
	const toFetch = useRef<boolean>(false);
	const { i18n } = useTranslation();
	const { t } = useTranslation();
	const { fetchCurrentByName } = useLotteryUpdate();

	useEffect(() => {
		const intervalId = setInterval(() => checkTime(), 1000);
		return function cleanup() {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const checkTime = () => {
		timeDifference = drawTime - Math.round((new Date()).getTime() / 1000);
		if (timeDifference <= 0) {
			if (!drawInProgress) setDrawInProgress(true);
		} else if (drawInProgress) setDrawInProgress(false);

		if (reFetch && timeDifference <= -GLOBAL_SETTINGS.fetchCurrentAfterDrawInSeconds) {
			if (!toFetch.current) {
				toFetch.current = true;
				fetchCurrentByName(lotteryName);
			}
		}
	};

	return (
		<Fragment>
			{timeDifference > 0
				? <span>
					{
						timeDifference >= GLOBAL_SETTINGS.IntervalToShowTimerBeforeDrawInSeconds
							? <>
								{unixToDate(drawTime, i18n.language)}
							</>
							: <ReactTimeAgo date={new Date(drawTime * 1000)}
											locale={i18n.language} />
					}
				</span>
				: <span>
					{
						reFetch
							? <>{t('draw_in_progress')}</>
							: <>{unixToDate(drawTime, i18n.language)}</>
					}
				</span>
			}
		</Fragment>
	);
};

export default DrawTimeElement;
