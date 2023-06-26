import { MouseEvent } from 'react';
import styled from 'styled-components';
import { lotteryColorBtn, text } from '../../../../constants/colors';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TicketButton } from '../../../../components/Button';

const AdminMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  gap: 1rem;
`;

const TitleWrapper = styled.h2`
  color: ${text};
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const AdminMain = () => {
	const history = useHistory();
	const { url } = useRouteMatch();
	const { t } = useTranslation();

	const onLotteries = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push(`${url}/lotteries`);
	};

	const onGovernance = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push(`${url}/governance`);
	};

	const onRandomness = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push(`${url}/randomness`);
	};

	return (
		<AdminMainWrapper>
			<TitleWrapper>
				{t('admin_panel')}
			</TitleWrapper>
			<TicketButton bgColor={lotteryColorBtn['lottery645']} onClick={onLotteries}>
				{t('lotteries')}
			</TicketButton>
			<TicketButton bgColor={lotteryColorBtn['lottery420']} onClick={onGovernance}>
				{t('governance')}
			</TicketButton>
			<TicketButton bgColor={lotteryColorBtn['lottery749']} onClick={onRandomness}>
				{t('randomness')}
			</TicketButton>
		</AdminMainWrapper>
	);
};

export default AdminMain;
